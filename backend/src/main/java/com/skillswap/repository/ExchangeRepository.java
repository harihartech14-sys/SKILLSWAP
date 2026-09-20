package com.skillswap.repository;

import com.skillswap.model.Exchange;
import com.skillswap.model.ExchangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    List<Exchange> findByStatus(ExchangeStatus status);
    List<Exchange> findByRequestId(Long requestId);
}
