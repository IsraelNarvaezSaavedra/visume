package com.visume.backend.controller;

public class HomeController  {
    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Visume API funcionando correctamente");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
