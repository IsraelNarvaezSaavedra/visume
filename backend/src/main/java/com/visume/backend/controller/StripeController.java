package com.visume.backend.controller;

import com.stripe.model.checkout.Session;
import com.visume.backend.dto.StripeDTO;
import com.visume.backend.entities.Usuarios;
import com.visume.backend.repositories.UsuariosRepository;
import com.visume.backend.service.StripeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = {
    "http://isra.francecentral.cloudapp.azure.com",
    "https://isra.francecentral.cloudapp.azure.com",
    "http://localhost:5173",
    "http://localhost:3000"
})
public class StripeController {

    private final StripeService stripeService;
    private final UsuariosRepository usuariosRepo;

    public StripeController(StripeService stripeService, UsuariosRepository usuariosRepo) {
        this.stripeService = stripeService;
        this.usuariosRepo = usuariosRepo;
    }

    // Crea sesión de pago y devuelve la URL de Stripe
    @PostMapping("/checkout")
    public ResponseEntity<?> crearCheckout(@AuthenticationPrincipal String username) {
        try {
            Usuarios usuario = usuariosRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (usuario.isEstaPagando())
                return ResponseEntity.badRequest().body("Ya tienes una suscripción activa");

            Session session = stripeService.crearSesionPago(username, usuario.getEmail());

            StripeDTO dto = new StripeDTO();
            dto.setSessionId(session.getId());
            dto.setUrl(session.getUrl());
            dto.setPublishableKey(stripeService.getPublishableKey());

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Portal para gestionar/cancelar suscripción
    @PostMapping("/portal")
    public ResponseEntity<?> abrirPortal(@AuthenticationPrincipal String username) {
        try {
            String url = stripeService.crearPortalSuscripcion(username);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmarPago(@AuthenticationPrincipal String username,
                                           @RequestParam("session_id") String sessionId) {
        try {
            Session session = stripeService.confirmarSuscripcion(username, sessionId);
            return ResponseEntity.ok(Map.of(
                    "confirmed", true,
                    "sessionId", session.getId(),
                    "paymentStatus", session.getPaymentStatus(),
                    "status", session.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Webhook de Stripe — debe ser público (sin JWT)
    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(@RequestBody String payload,
                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            stripeService.procesarWebhook(payload, sigHeader);
            return ResponseEntity.ok(Map.of("received", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Estado de suscripción del usuario
    @GetMapping("/estado")
    public ResponseEntity<?> estado(@AuthenticationPrincipal String username) {
        Usuarios usuario = usuariosRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(Map.of(
            "estaPagando", usuario.isEstaPagando(),
            "tieneStripe", usuario.getStripeCustomerId() != null
        ));
    }
}