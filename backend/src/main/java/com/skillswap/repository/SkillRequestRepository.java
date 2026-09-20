package com.skillswap.repository;

import com.skillswap.model.SkillRequest;
import com.skillswap.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRequestRepository extends JpaRepository<SkillRequest, Long> {
    List<SkillRequest> findByRequesterId(Long requesterId);
    List<SkillRequest> findByReceiverId(Long receiverId);
    List<SkillRequest> findByStatus(RequestStatus status);
}
