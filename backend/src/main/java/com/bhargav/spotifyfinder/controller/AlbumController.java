package com.bhargav.spotifyfinder.controller;

import com.bhargav.spotifyfinder.dto.ComparisonResponse;
import com.bhargav.spotifyfinder.model.Album;
import com.bhargav.spotifyfinder.model.SearchHistory;
import com.bhargav.spotifyfinder.model.User;
import com.bhargav.spotifyfinder.repository.SearchHistoryRepository;
import com.bhargav.spotifyfinder.repository.UserRepository;
import com.bhargav.spotifyfinder.service.SpotifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {

    private final SpotifyService spotifyService;
    private final UserRepository userRepository;
    private final SearchHistoryRepository searchHistoryRepository;

    public AlbumController(SpotifyService spotifyService,
                           UserRepository userRepository,
                           SearchHistoryRepository searchHistoryRepository) {
        this.spotifyService = spotifyService;
        this.userRepository = userRepository;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Album>> searchAlbums(@RequestParam("query") String query,
                                                    Authentication authentication) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        // If authenticated user searches, record in search history
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            userRepository.findByEmail(email).ifPresent(user -> {
                SearchHistory history = new SearchHistory(user, query.trim());
                searchHistoryRepository.save(history);
            });
        }

        List<Album> albums = spotifyService.searchAlbums(query);
        return ResponseEntity.ok(albums);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Album> getAlbumById(@PathVariable("id") String id) {
        Album album = spotifyService.getAlbumById(id);
        return ResponseEntity.ok(album);
    }

    @GetMapping("/compare")
    public ResponseEntity<ComparisonResponse> compareAlbums(@RequestParam("id1") String id1,
                                                            @RequestParam("id2") String id2) {
        ComparisonResponse comparison = spotifyService.compareAlbums(id1, id2);
        return ResponseEntity.ok(comparison);
    }

    @GetMapping("/mood/{mood}")
    public ResponseEntity<List<Album>> getAlbumsByMood(@PathVariable("mood") String mood) {
        List<Album> albums = spotifyService.getAlbumsByMood(mood);
        return ResponseEntity.ok(albums);
    }
}
