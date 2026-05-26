package com.visume.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    public StripeService(UsuariosRepository usuariosRepo) {
        this.usuariosRepo = usuariosRepo;
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
            u.setStripeCustomerId(customerId);
            usuariosRepo.save(u);
        });
    }

    private void renovarPremium(String customerId) {
        usuariosRepo.findByStripeCustomerId(customerId).ifPresent(u -> {
            u.setEstaPagando(true);
            usuariosRepo.save(u);
        });
    }

    private void desactivarPremium(String customerId) {
        usuariosRepo.findByStripeCustomerId(customerId).ifPresent(u -> {
            u.setEstaPagando(false);
            u.setStripeCustomerId(null);
            usuariosRepo.save(u);
        });
    }
}