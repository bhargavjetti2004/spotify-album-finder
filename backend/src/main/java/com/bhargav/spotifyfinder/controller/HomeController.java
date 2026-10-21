package com.bhargav.spotifyfinder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "app", "Spotify Album Finder API",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now().toString(),
                "message", "Welcome to Spotify Album Finder REST API! Backend is running successfully.",
                "endpoints", Map.of(
                        "auth", "/api/auth/register, /api/auth/login",
                        "albums", "/api/albums/search?q={query}, /api/albums/{id}, /api/albums/mood/{mood}",
                        "compare", "/api/albums/compare?id1={id1}&id2={id2}",
                        "favorites", "/api/favorites",
                        "history", "/api/history"
                )
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}