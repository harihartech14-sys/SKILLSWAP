package com.skillswap.repository;

import com.skillswap.model.ExchangeMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeMessageRepository extends JpaRepository<ExchangeMessage, Long> {
    List<ExchangeMessage> findByExchangeIdOrderBySentAtAsc(Long exchangeId);
}
