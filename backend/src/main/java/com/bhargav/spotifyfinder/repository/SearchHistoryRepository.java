package com.bhargav.spotifyfinder.repository;

import com.bhargav.spotifyfinder.model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    List<SearchHistory> findTop10ByUserIdOrderBySearchedAtDesc(Long userId);

    List<SearchHistory> findByUserIdOrderBySearchedAtDesc(Long userId);
}
