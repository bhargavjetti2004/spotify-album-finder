package com.bhargav.spotifyfinder.controller;

import com.bhargav.spotifyfinder.model.SearchHistory;
import com.bhargav.spotifyfinder.model.User;
import com.bhargav.spotifyfinder.repository.SearchHistoryRepository;
import com.bhargav.spotifyfinder.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    public HistoryController(SearchHistoryRepository searchHistoryRepository, UserRepository userRepository) {
        this.searchHistoryRepository = searchHistoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<SearchHistory>> getHistory(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<SearchHistory> history = searchHistoryRepository.findTop10ByUserIdOrderBySearchedAtDesc(user.getId());
        return ResponseEntity.ok(history);
    }
}
