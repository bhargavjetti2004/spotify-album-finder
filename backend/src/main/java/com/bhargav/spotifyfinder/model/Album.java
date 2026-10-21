package com.bhargav.spotifyfinder.model;

public class Album {

    private String id;
    private String name;
    private String artist;
    private String releaseDate;
    private int totalTracks;
    private int popularity;
    private String imageUrl;
    private String spotifyUrl;

    public Album() {
    }

    public Album(String id, String name, String artist, String releaseDate, int totalTracks, int popularity, String imageUrl, String spotifyUrl) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.releaseDate = releaseDate;
        this.totalTracks = totalTracks;
        this.popularity = popularity;
        this.imageUrl = imageUrl;
        this.spotifyUrl = spotifyUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public int getTotalTracks() {
        return totalTracks;
    }

    public void setTotalTracks(int totalTracks) {
        this.totalTracks = totalTracks;
    }

    public int getPopularity() {
        return popularity;
    }

    public void setPopularity(int popularity) {
        this.popularity = popularity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSpotifyUrl() {
        return spotifyUrl;
    }

    public void setSpotifyUrl(String spotifyUrl) {
        this.spotifyUrl = spotifyUrl;
    }
}
