package com.visume.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.visume.backend.entities.Pagos;
import com.visume.backend.entities.Planes;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.PagosRepository;
import com.visume.backend.repositories.PlanesRepository;
import com.visume.backend.repositories.UsuariosRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${stripe.price.id}")
    private String priceId;

    @Value("${frontend.url}")
    private String frontendUrl;

    private final UsuariosRepository usuariosRepo;
    private final PlanesRepository planesRepo;
    private final PagosRepository pagosRepo;

    public StripeService(UsuariosRepository usuariosRepo, PlanesRepository planesRepo, PagosRepository pagosRepo) {
        this.usuariosRepo = usuariosRepo;
        this.planesRepo = planesRepo;
        this.pagosRepo = pagosRepo;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String getPublishableKey() {
        return publishableKey;
    }

    // Crea una sesión de pago de Stripe
    public Session crearSesionPago(String username, String email) throws Exception {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomerEmail(email)
                .setSuccessUrl(frontendUrl + "?pago=exito&session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "?pago=cancelado")
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build()
                )
                .putMetadata("username", username)
                .build();

        return Session.create(params);
    }

    public Session confirmarSuscripcion(String username, String sessionId) throws Exception {
        Session session = Session.retrieve(sessionId);

        String usernameSession = session.getMetadata() != null ? session.getMetadata().get("username") : null;
        if (usernameSession != null && !usernameSession.equals(username)) {
            throw new RuntimeException("La sesión de Stripe no corresponde al usuario autenticado");
        }

        boolean pagoConfirmado = "paid".equalsIgnoreCase(session.getPaymentStatus())
                || "complete".equalsIgnoreCase(session.getStatus());

        if (!pagoConfirmado) {
            throw new RuntimeException("El pago todavía no está confirmado");
        }

        activarPremium(username, session.getCustomer());
        registrarPagoDesdeSesion(session, username);
        return session;
    }

    // Crea sesión del portal para gestionar/cancelar suscripción
    public String crearPortalSuscripcion(String username) throws Exception {
        Usuarios usuario = usuariosRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getStripeCustomerId() == null)
            throw new RuntimeException("No tienes una suscripción activa");

        com.stripe.param.billingportal.SessionCreateParams params =
            com.stripe.param.billingportal.SessionCreateParams.builder()
                .setCustomer(usuario.getStripeCustomerId())
                .setReturnUrl(frontendUrl + "/perfil")
                .build();

        com.stripe.model.billingportal.Session session =
            com.stripe.model.billingportal.Session.create(params);

        return session.getUrl();
    }

    // Procesa los eventos del webhook de Stripe
    public void procesarWebhook(String payload, String sigHeader) throws Exception {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Webhook inválido: " + e.getMessage());
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                String username = session.getMetadata().get("username");
                String customerId = session.getCustomer();
                activarPremium(username, customerId);
            registrarPagoDesdeSesion(session, username);
            }
            case "invoice.payment_succeeded" -> {
                Invoice invoice = (Invoice) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                renovarPremium(invoice.getCustomer());
            }
            case "customer.subscription.deleted" -> {
                Subscription sub = (Subscription) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                desactivarPremium(sub.getCustomer());
            }
        }
    }

    private void activarPremium(String username, String customerId) {
        usuariosRepo.findByUsername(username).ifPresent(u -> {
            u.setEstaPagando(true);
            planesRepo.findByNombreIgnoreCase("Premium").ifPresent(u::setPlan);
            if (customerId != null) {
                u.setStripeCustomerId(customerId);
            }
            usuariosRepo.save(u);
        });
    }

    private void renovarPremium(String customerId) {
        usuariosRepo.findByStripeCustomerId(customerId).ifPresent(u -> {
            u.setEstaPagando(true);
            planesRepo.findByNombreIgnoreCase("Premium").ifPresent(u::setPlan);
            usuariosRepo.save(u);
        });
    }

    private void desactivarPremium(String customerId) {
        usuariosRepo.findByStripeCustomerId(customerId).ifPresent(u -> {
            u.setEstaPagando(false);
            planesRepo.findByNombreIgnoreCase("Free").ifPresent(u::setPlan);
            u.setStripeCustomerId(null);
            usuariosRepo.save(u);
        });
    }

    private void registrarPagoDesdeSesion(Session session, String username) {
        String transaccionId = session.getId();
        if (pagosRepo.findByTransaccionId(transaccionId).isPresent()) {
            return;
        }

        Usuarios usuario = usuariosRepo.findByUsername(username).orElse(null);
        Planes plan = planesRepo.findByNombreIgnoreCase("Premium").orElse(null);
        if (usuario == null || plan == null) {
            return;
        }

        Pagos pago = new Pagos();
        pago.setUsuario(usuario);
        pago.setPlan(plan);
        pago.setMonto(BigDecimal.valueOf(session.getAmountTotal() != null ? session.getAmountTotal() : 0L).movePointLeft(2));
        pago.setMetodoPago("stripe");
        pago.setEstado(session.getPaymentStatus() != null ? session.getPaymentStatus() : "paid");
        pago.setFechaPago(LocalDateTime.now());
        pago.setTransaccionId(transaccionId);
        pago.setNotas("Customer: " + session.getCustomer());

        pagosRepo.save(pago);
    }
}