package com.bhargav.spotifyfinder.dto;

import com.bhargav.spotifyfinder.model.Album;

public class ComparisonResponse {

    private Album album1;
    private Album album2;
    private int album1Score;
    private int album2Score;
    private String winner;
    private String winnerAlbumName;
    private String explanation;

    public ComparisonResponse() {
    }

    public ComparisonResponse(Album album1, Album album2, int album1Score, int album2Score, String winner, String winnerAlbumName, String explanation) {
        this.album1 = album1;
        this.album2 = album2;
        this.album1Score = album1Score;
        this.album2Score = album2Score;
        this.winner = winner;
        this.winnerAlbumName = winnerAlbumName;
        this.explanation = explanation;
    }

    public Album getAlbum1() {
        return album1;
    }

    public void setAlbum1(Album album1) {
        this.album1 = album1;
    }

    public Album getAlbum2() {
        return album2;
    }

    public void setAlbum2(Album album2) {
        this.album2 = album2;
    }

    public int getAlbum1Score() {
        return album1Score;
    }

    public void setAlbum1Score(int album1Score) {
        this.album1Score = album1Score;
    }

    public int getAlbum2Score() {
        return album2Score;
    }

    public void setAlbum2Score(int album2Score) {
        this.album2Score = album2Score;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public String getWinnerAlbumName() {
        return winnerAlbumName;
    }

    public void setWinnerAlbumName(String winnerAlbumName) {
        this.winnerAlbumName = winnerAlbumName;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
