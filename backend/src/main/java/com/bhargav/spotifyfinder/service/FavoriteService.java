package com.bhargav.spotifyfinder.service;

import com.bhargav.spotifyfinder.model.Favorite;
import com.bhargav.spotifyfinder.model.User;
import com.bhargav.spotifyfinder.repository.FavoriteRepository;
import com.bhargav.spotifyfinder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
    }

    public List<Favorite> getUserFavorites(String userEmail) {
        User user = getUserByEmail(userEmail);
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Favorite addFavorite(String userEmail, Favorite favorite) {
        User user = getUserByEmail(userEmail);

        if (favoriteRepository.existsByUserIdAndSpotifyAlbumId(user.getId(), favorite.getSpotifyAlbumId())) {
            throw new IllegalArgumentException("Album is already in your favorites");
        }

        favorite.setUser(user);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userEmail, Long favoriteId) {
        User user = getUserByEmail(userEmail);

        Favorite favorite = favoriteRepository.findByIdAndUserId(favoriteId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found or does not belong to you"));

        favoriteRepository.delete(favorite);
    }

    public boolean isFavorite(String userEmail, String spotifyAlbumId) {
        User user = getUserByEmail(userEmail);
        return favoriteRepository.existsByUserIdAndSpotifyAlbumId(user.getId(), spotifyAlbumId);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }
}
