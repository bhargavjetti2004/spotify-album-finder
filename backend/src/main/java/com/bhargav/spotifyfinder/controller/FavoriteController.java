package com.bhargav.spotifyfinder.controller;

import com.bhargav.spotifyfinder.model.Favorite;
import com.bhargav.spotifyfinder.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getFavorites(Authentication authentication) {
        List<Favorite> favorites = favoriteService.getUserFavorites(authentication.getName());
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<Favorite> addFavorite(@RequestBody Favorite favorite, Authentication authentication) {
        Favorite saved = favoriteService.addFavorite(authentication.getName(), favorite);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeFavorite(@PathVariable("id") Long id, Authentication authentication) {
        favoriteService.removeFavorite(authentication.getName(), id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Album removed from favorites"));
    }

    @GetMapping("/check/{spotifyAlbumId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable("spotifyAlbumId") String spotifyAlbumId,
                                                              Authentication authentication) {
        boolean isFav = favoriteService.isFavorite(authentication.getName(), spotifyAlbumId);
        return ResponseEntity.ok(Collections.singletonMap("isFavorite", isFav));
    }
}
