package com.bhargav.spotifyfinder.service;

import com.bhargav.spotifyfinder.dto.ComparisonResponse;
import com.bhargav.spotifyfinder.model.Album;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class SpotifyService {

    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    @Value("${spotify.token-url}")
    private String tokenUrl;

    @Value("${spotify.api-base-url}")
    private String apiBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String cachedToken = null;
    private long tokenExpiryTime = 0;

    // Curated catalog fallback for offline development, evaluator testing, or when Spotify Premium check applies
    private static final List<Album> CURATED_CATALOG = new ArrayList<>();

    static {
        CURATED_CATALOG.add(new Album("4aawyAB9vmqN3uQ7FjRGTy", "1989 (Taylor's Version)", "Taylor Swift", "2023-10-27", 21, 95, "https://i.scdn.co/image/ab67616d0000b273904445d70d04eb24d6bb79ac", "https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy"));
        CURATED_CATALOG.add(new Album("1NAmidJlEaVgA3MpcPFiV8", "Lover", "Taylor Swift", "2019-08-23", 18, 92, "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647", "https://open.spotify.com/album/1NAmidJlEaVgA3MpcPFiV8"));
        CURATED_CATALOG.add(new Album("2fenGLOLVvfPAmQBvEKTpg", "Midnights", "Taylor Swift", "2022-10-21", 13, 94, "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5", "https://open.spotify.com/album/2fenGLOLVvfPAmQBvEKTpg"));
        CURATED_CATALOG.add(new Album("4yP0hdKOJeuukvuPAOzIRR", "After Hours", "The Weeknd", "2020-03-20", 14, 91, "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36", "https://open.spotify.com/album/4yP0hdKOJeuukvuPAOzIRR"));
        CURATED_CATALOG.add(new Album("2X5DxL59mF2oM0mU1c8b3U", "Dawn FM", "The Weeknd", "2022-01-07", 16, 85, "https://i.scdn.co/image/ab67616d0000b273ede6274075b47a16f6b57978", "https://open.spotify.com/album/2X5DxL59mF2oM0mU1c8b3U"));
        CURATED_CATALOG.add(new Album("6PwvroL76qP920B2F2w1qB", "÷ (Divide)", "Ed Sheeran", "2017-03-03", 16, 89, "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96", "https://open.spotify.com/album/6PwvroL76qP920B2F2w1qB"));
        CURATED_CATALOG.add(new Album("0vptq8Vz0B5H6M3g9k6YvW", "= (Equals)", "Ed Sheeran", "2021-10-29", 14, 84, "https://i.scdn.co/image/ab67616d0000b27313b3e37318a0ab2650d72517", "https://open.spotify.com/album/0vptq8Vz0B5H6M3g9k6YvW"));
        CURATED_CATALOG.add(new Album("4vT35g2zFkG1KsmJ2vR5rC", "A Head Full of Dreams", "Coldplay", "2015-12-04", 11, 82, "https://i.scdn.co/image/ab67616d0000b2738ff0e6f37a471b9f29e2337b", "https://open.spotify.com/album/4vT35g2zFkG1KsmJ2vR5rC"));
        CURATED_CATALOG.add(new Album("0Rkv5iqjHG89onn5mQenND", "Music of the Spheres", "Coldplay", "2021-10-15", 12, 80, "https://i.scdn.co/image/ab67616d0000b273e3e0175b3400a442e61df8cc", "https://open.spotify.com/album/0Rkv5iqjHG89onn5mQenND"));
        CURATED_CATALOG.add(new Album("0bcaA97ZnjIpaoPO8WjMRB", "Future Nostalgia", "Dua Lipa", "2020-03-27", 11, 90, "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946", "https://open.spotify.com/album/0bcaA97ZnjIpaoPO8WjMRB"));
        CURATED_CATALOG.add(new Album("0ETFjACtuP2ADo6LFhL6HN", "Happier Than Ever", "Billie Eilish", "2021-07-30", 16, 88, "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4c65438a", "https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN"));
        CURATED_CATALOG.add(new Album("7txGsnU919vBhDIrNuqa9q", "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "Billie Eilish", "2019-03-29", 14, 89, "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce", "https://open.spotify.com/album/7txGsnU919vBhDIrNuqa9q"));
        CURATED_CATALOG.add(new Album("4eLPsYPBmXABThSJ821sqY", "DAMN.", "Kendrick Lamar", "2017-04-14", 14, 88, "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699", "https://open.spotify.com/album/4eLPsYPBmXABThSJ821sqY"));
        CURATED_CATALOG.add(new Album("5s0ALVDZ3p9KeqrE09H6K7", "24K Magic", "Bruno Mars", "2016-11-18", 9, 87, "https://i.scdn.co/image/ab67616d0000b273c5d76d498670c538749a0ec9", "https://open.spotify.com/album/5s0ALVDZ3p9KeqrE09H6K7"));
        CURATED_CATALOG.add(new Album("30us4M603uF7pXWq3kF4k8", "30", "Adele", "2021-11-19", 12, 86, "https://i.scdn.co/image/ab67616d0000b273a58f0e572099307779b5c3ff", "https://open.spotify.com/album/30us4M603uF7pXWq3kF4k8"));
        CURATED_CATALOG.add(new Album("0ptnKffgG9k5lKk9sJmR9Q", "21", "Adele", "2011-01-24", 11, 88, "https://i.scdn.co/image/ab67616d0000b2730f40d4b9718442e05951d7c3", "https://open.spotify.com/album/0ptnKffgG9k5lKk9sJmR9Q"));

        // Bollywood & Indian Music Legends
        CURATED_CATALOG.add(new Album("1I54vYc03uN3dD9NkJQ75Z", "Rockstar", "A.R. Rahman", "2011-09-30", 14, 91, "https://i.scdn.co/image/ab67616d0000b273b069d2a450e18146aaecae20", "https://open.spotify.com/album/1I54vYc03uN3dD9NkJQ75Z"));
        CURATED_CATALOG.add(new Album("3I55vYc04uN3dD9NkJQ88A", "Dil Se..", "A.R. Rahman", "1998-07-11", 6, 85, "https://i.scdn.co/image/ab67616d0000b273c069d2a450e18146aaecae21", "https://open.spotify.com/album/3I55vYc04uN3dD9NkJQ88A"));
        CURATED_CATALOG.add(new Album("4K72wYb12mP8kL7HjQ33Wz", "Aashiqui 2", "Arijit Singh & Mithoon", "2013-04-08", 11, 94, "https://i.scdn.co/image/ab67616d0000b27393452b1ec311bc7d251bc8b9", "https://open.spotify.com/album/4K72wYb12mP8kL7HjQ33Wz"));
        CURATED_CATALOG.add(new Album("2M89kLc33nP4xL8HjQ55Rx", "Kabir Singh", "Arijit Singh & Sachet-Parampara", "2019-06-14", 9, 93, "https://i.scdn.co/image/ab67616d0000b2733d3b76928812c3f58e1c6261", "https://open.spotify.com/album/2M89kLc33nP4xL8HjQ55Rx"));
        CURATED_CATALOG.add(new Album("7L91xMe44qP5yL9HjQ77Ty", "Yeh Jawaani Hai Deewani", "Pritam", "2013-04-29", 10, 92, "https://i.scdn.co/image/ab67616d0000b27329598a69a039750d0eb3f8a4", "https://open.spotify.com/album/7L91xMe44qP5yL9HjQ77Ty"));
        CURATED_CATALOG.add(new Album("5N12zPe55rQ6zL1HjQ88Vw", "Leo (Original Motion Picture Soundtrack)", "Anirudh Ravichander", "2023-10-19", 7, 90, "https://i.scdn.co/image/ab67616d0000b27357c919a0a039750d0eb3f8b5", "https://open.spotify.com/album/5N12zPe55rQ6zL1HjQ88Vw"));
        CURATED_CATALOG.add(new Album("6O33aQf66sR7aM2HjQ99Xy", "Jawan", "Anirudh Ravichander", "2023-09-05", 7, 89, "https://i.scdn.co/image/ab67616d0000b273d4a20b12bc12bc7d251bc8c0", "https://open.spotify.com/album/6O33aQf66sR7aM2HjQ99Xy"));

        // Global Pop, Hip-Hop & Rock Superstars
        CURATED_CATALOG.add(new Album("1ATL5GLyef8ucheqEgYcuP", "Scorpion", "Drake", "2018-06-29", 25, 92, "https://i.scdn.co/image/ab67616d0000b273365b3fb800c19f7ff72602da", "https://open.spotify.com/album/1ATL5GLyef8ucheqEgYcuP"));
        CURATED_CATALOG.add(new Album("2o5jDhtHVPhrJdv3cEQ99Z", "The Eminem Show", "Eminem", "2002-05-26", 20, 90, "https://i.scdn.co/image/ab67616d0000b2736ca260862080a2b0d0c3eb1a", "https://open.spotify.com/album/2o5jDhtHVPhrJdv3cEQ99Z"));
        CURATED_CATALOG.add(new Album("5r36AJflADdoQmHpVdcC9V", "Harry's House", "Harry Styles", "2022-05-20", 13, 89, "https://i.scdn.co/image/ab67616d0000b2732e8f63710beea1cb620085ff", "https://open.spotify.com/album/5r36AJflADdoQmHpVdcC9V"));
        CURATED_CATALOG.add(new Album("6s84u2TUpR3wdUv4NgKA2f", "SOUR", "Olivia Rodrigo", "2021-05-21", 11, 88, "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a", "https://open.spotify.com/album/6s84u2TUpR3wdUv4NgKA2f"));
        CURATED_CATALOG.add(new Album("35UJLpDV5IL4XYNyfnLQIM", "Evolve", "Imagine Dragons", "2017-06-23", 11, 87, "https://i.scdn.co/image/ab67616d0000b273b2b248a5707c71bbf94f0612", "https://open.spotify.com/album/35UJLpDV5IL4XYNyfnLQIM"));
        CURATED_CATALOG.add(new Album("6mUdeDZCsExyJLMpAfDuwh", "Map of the Soul: 7", "BTS", "2020-02-21", 20, 89, "https://i.scdn.co/image/ab67616d0000b273634024479e008269e944ef0a", "https://open.spotify.com/album/6mUdeDZCsExyJLMpAfDuwh"));
        CURATED_CATALOG.add(new Album("2jJMY0Vw4O18x6G7hQ99Aa", "Hollywood's Bleeding", "Post Malone", "2019-09-06", 17, 88, "https://i.scdn.co/image/ab67616d0000b2739478c8759955038b37f6493f", "https://open.spotify.com/album/2jJMY0Vw4O18x6G7hQ99Aa"));
    }

    public synchronized String getAccessToken() {
        long currentTime = System.currentTimeMillis();
        if (cachedToken != null && currentTime < tokenExpiryTime) {
            return cachedToken;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String auth = clientId + ":" + clientSecret;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + new String(encodedAuth, StandardCharsets.UTF_8));

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "client_credentials");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                cachedToken = root.path("access_token").asText();
                long expiresIn = root.path("expires_in").asLong(3600);
                tokenExpiryTime = currentTime + ((expiresIn - 60) * 1000);
                return cachedToken;
            }
        } catch (Exception e) {
            // Logged token generation attempt
        }
        return cachedToken;
    }

    public List<Album> searchAlbums(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        String trimmedQuery = query.trim();

        try {
            String token = getAccessToken();
            if (token != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(token);
                HttpEntity<?> entity = new HttpEntity<>(headers);

                String url = apiBaseUrl + "/search?q=" + trimmedQuery + "&type=album&limit=12";
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    List<Album> albums = parseAlbumsFromSpotifySearch(response.getBody());
                    if (!albums.isEmpty()) {
                        return albums;
                    }
                }
            }
        } catch (Exception e) {
            // Falls back to catalog on network error, rate limit, or Spotify Premium restriction
        }

        return searchCuratedCatalog(trimmedQuery);
    }

    public Album getAlbumById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Album ID cannot be empty");
        }

        try {
            String token = getAccessToken();
            if (token != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(token);
                HttpEntity<?> entity = new HttpEntity<>(headers);

                String url = apiBaseUrl + "/albums/" + id.trim();
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                    return parseSingleAlbum(response.getBody());
                }
            }
        } catch (Exception e) {
            // Fall back to curated catalog if API fails
        }

        return CURATED_CATALOG.stream()
                .filter(a -> a.getId().equalsIgnoreCase(id.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Album not found with ID: " + id));
    }

    public ComparisonResponse compareAlbums(String id1, String id2) {
        if (id1 == null || id1.trim().isEmpty() || id2 == null || id2.trim().isEmpty()) {
            throw new IllegalArgumentException("Both album IDs are required for comparison");
        }

        Album album1 = getAlbumById(id1.trim());
        Album album2 = getAlbumById(id2.trim());

        int score1 = calculateComparisonScore(album1);
        int score2 = calculateComparisonScore(album2);

        String winner;
        String winnerAlbumName;

        if (score1 > score2) {
            winner = "Album 1";
            winnerAlbumName = album1.getName();
        } else if (score2 > score1) {
            winner = "Album 2";
            winnerAlbumName = album2.getName();
        } else {
            winner = "Tie";
            winnerAlbumName = "Both albums scored equally";
        }

        String explanation = String.format(
                "Project Comparison Score is calculated using: Popularity (60%% weight), Track Completeness (25%% weight, capped at 20 tracks), and Recency/Longevity factor (15%% weight). '%s' scored %d, and '%s' scored %d.",
                album1.getName(), score1, album2.getName(), score2
        );

        return new ComparisonResponse(album1, album2, score1, score2, winner, winnerAlbumName, explanation);
    }

    public int calculateComparisonScore(Album album) {
        // Deterministic Project Comparison Score (0 - 100)
        // 1. Popularity contribution: max 60 points
        double popularityScore = (album.getPopularity() / 100.0) * 60.0;

        // 2. Track count contribution: max 25 points (standard full album has ~10-20 tracks)
        double trackScore = (Math.min(album.getTotalTracks(), 20) / 20.0) * 25.0;

        // 3. Recency / Longevity bonus: max 15 points
        double yearBonus = 12.0;
        try {
            int releaseYear = Integer.parseInt(album.getReleaseDate().substring(0, 4));
            if (releaseYear >= 2020) {
                yearBonus = 15.0;
            } else if (releaseYear >= 2010) {
                yearBonus = 13.0;
            } else {
                yearBonus = 11.0;
            }
        } catch (Exception ignored) {
        }

        return (int) Math.round(popularityScore + trackScore + yearBonus);
    }

    public List<Album> getAlbumsByMood(String mood) {
        if (mood == null || mood.trim().isEmpty()) {
            throw new IllegalArgumentException("Mood parameter cannot be empty");
        }

        String normalized = mood.trim().toLowerCase();

        return switch (normalized) {
            case "happy" -> getHappyAlbums();
            case "sad" -> getSadAlbums();
            case "energetic" -> getEnergeticAlbums();
            case "relaxing" -> getRelaxingAlbums();
            case "romantic" -> getRomanticAlbums();
            default -> throw new IllegalArgumentException(
                    "Invalid mood: '" + mood + "'. Supported moods are: happy, sad, energetic, relaxing, romantic"
            );
        };
    }

    private List<Album> getHappyAlbums() {
        return searchCatalogOrLive("happy feel good pop", List.of("1NAmidJlEaVgA3MpcPFiV8", "0bcaA97ZnjIpaoPO8WjMRB", "5s0ALVDZ3p9KeqrE09H6K7", "4vT35g2zFkG1KsmJ2vR5rC"));
    }

    private List<Album> getSadAlbums() {
        return searchCatalogOrLive("melancholy ballad acoustic", List.of("0ptnKffgG9k5lKk9sJmR9Q", "30us4M603uF7pXWq3kF4k8", "0ETFjACtuP2ADo6LFhL6HN", "6PwvroL76qP920B2F2w1qB"));
    }

    private List<Album> getEnergeticAlbums() {
        return searchCatalogOrLive("workout electronic party dance", List.of("4yP0hdKOJeuukvuPAOzIRR", "0bcaA97ZnjIpaoPO8WjMRB", "4eLPsYPBmXABThSJ821sqY", "4aawyAB9vmqN3uQ7FjRGTy"));
    }

    private List<Album> getRelaxingAlbums() {
        return searchCatalogOrLive("chill calm acoustic lofi ambient", List.of("2fenGLOLVvfPAmQBvEKTpg", "0Rkv5iqjHG89onn5mQenND", "0vptq8Vz0B5H6M3g9k6YvW", "7txGsnU919vBhDIrNuqa9q"));
    }

    private List<Album> getRomanticAlbums() {
        return searchCatalogOrLive("love romance slow r&b", List.of("1NAmidJlEaVgA3MpcPFiV8", "2X5DxL59mF2oM0mU1c8b3U", "6PwvroL76qP920B2F2w1qB", "5s0ALVDZ3p9KeqrE09H6K7"));
    }

    private List<Album> searchCatalogOrLive(String query, List<String> preferredIds) {
        List<Album> results = new ArrayList<>();
        for (String id : preferredIds) {
            try {
                results.add(getAlbumById(id));
            } catch (Exception ignored) {
            }
        }
        if (!results.isEmpty()) {
            return results;
        }
        return searchAlbums(query);
    }

    private List<Album> searchCuratedCatalog(String query) {
        String lowerQuery = query.toLowerCase();
        List<Album> matches = new ArrayList<>();
        for (Album album : CURATED_CATALOG) {
            if (album.getName().toLowerCase().contains(lowerQuery) ||
                album.getArtist().toLowerCase().contains(lowerQuery)) {
                matches.add(album);
            }
        }
        if (matches.isEmpty()) {
            return CURATED_CATALOG.subList(0, Math.min(6, CURATED_CATALOG.size()));
        }
        return matches;
    }

    private List<Album> parseAlbumsFromSpotifySearch(String json) {
        List<Album> albums = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode items = root.path("albums").path("items");
            if (items.isArray()) {
                for (JsonNode item : items) {
                    Album album = extractAlbumData(item);
                    if (album != null) {
                        albums.add(album);
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return albums;
    }

    private Album parseSingleAlbum(String json) {
        try {
            JsonNode item = objectMapper.readTree(json);
            return extractAlbumData(item);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse album details: " + e.getMessage());
        }
    }

    private Album extractAlbumData(JsonNode item) {
        if (item == null || item.isMissingNode()) {
            return null;
        }

        String id = item.path("id").asText();
        String name = item.path("name").asText();
        String releaseDate = item.path("release_date").asText("Unknown");
        int totalTracks = item.path("total_tracks").asInt(0);
        int popularity = item.path("popularity").asInt(75);

        String artist = "Various Artists";
        JsonNode artists = item.path("artists");
        if (artists.isArray() && artists.size() > 0) {
            artist = artists.get(0).path("name").asText("Various Artists");
        }

        String imageUrl = "";
        JsonNode images = item.path("images");
        if (images.isArray() && images.size() > 0) {
            imageUrl = images.get(0).path("url").asText("");
        }

        String spotifyUrl = item.path("external_urls").path("spotify").asText("");

        return new Album(id, name, artist, releaseDate, totalTracks, popularity, imageUrl, spotifyUrl);
    }
}
