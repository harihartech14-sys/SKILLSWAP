package com.skillswap.service;

import com.skillswap.model.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ExchangeService {
    private final SkillRequestRepository skillRequestRepository;
    private final ExchangeRepository exchangeRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ExchangeMessageRepository exchangeMessageRepository;

    public java.util.List<SkillRequest> getIncomingRequests(Long userId) {
        return skillRequestRepository.findByReceiverId(userId).stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING)
                .toList();
    }

    public java.util.List<SkillRequest> getSentRequests(Long userId) {
        return skillRequestRepository.findByRequesterId(userId);
    }

    public java.util.List<Exchange> getUserExchanges(Long userId) {
        return exchangeRepository.findAll().stream()
                .filter(ex -> ex.getRequest().getRequester().getId().equals(userId) || 
                              ex.getRequest().getReceiver().getId().equals(userId))
                .toList();
    }

    @Transactional
    public SkillRequest createRequest(Long requesterId, Long receiverId, Long offeredSkillId, Long requestedSkillId) {
        User requester = userRepository.findById(requesterId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        Skill offered = offeredSkillId != null ? skillRepository.findById(offeredSkillId).orElse(null) : null;
        Skill requested = skillRepository.findById(requestedSkillId).orElseThrow();

        SkillRequest req = new SkillRequest();
        req.setRequester(requester);
        req.setReceiver(receiver);
        req.setOfferedSkill(offered);
        req.setRequestedSkill(requested);
        req.setStatus(RequestStatus.PENDING);
        
        return skillRequestRepository.save(req);
    }

    @Transactional
    public Exchange acceptRequest(Long requestId) {
        SkillRequest req = skillRequestRepository.findById(requestId).orElseThrow();
        req.setStatus(RequestStatus.ACCEPTED);
        skillRequestRepository.save(req);

        Exchange ex = new Exchange();
        ex.setRequest(req);
        ex.setStatus(ExchangeStatus.IN_PROGRESS);
        ex.setStartDate(LocalDateTime.now());
        
        return exchangeRepository.save(ex);
    }

    public void rejectRequest(Long requestId) {
        SkillRequest req = skillRequestRepository.findById(requestId).orElseThrow();
        req.setStatus(RequestStatus.REJECTED);
        skillRequestRepository.save(req);
    }

    @Transactional
    public Exchange completeExchange(Long exchangeId) {
        Exchange ex = exchangeRepository.findById(exchangeId).orElseThrow();
        if (ex.getStatus() == ExchangeStatus.COMPLETED) {
            throw new IllegalStateException("Exchange is already completed.");
        }
        ex.setStatus(ExchangeStatus.COMPLETED);
        ex.setCompletedDate(LocalDateTime.now());
        Exchange saved = exchangeRepository.save(ex);

        // Award credits to both users
        User requester = ex.getRequest().getRequester();
        User receiver = ex.getRequest().getReceiver();
        
        requester.setCredits(requester.getCredits() + 10);
        receiver.setCredits(receiver.getCredits() + 10);
        
        userRepository.save(requester);
        userRepository.save(receiver);

        return saved;
    }

    @Transactional
    public Review addReview(Long exchangeId, Long reviewerId, Long revieweeId, Integer score, String comment) {
        Exchange ex = exchangeRepository.findById(exchangeId).orElseThrow();
        if (ex.getStatus() != ExchangeStatus.COMPLETED) {
            throw new IllegalStateException("Cannot review an incomplete exchange.");
        }
        
        // Prevent duplicate reviews
        boolean alreadyReviewed = reviewRepository.findAll().stream()
            .anyMatch(r -> r.getExchange().getId().equals(exchangeId) && r.getReviewer().getId().equals(reviewerId));
        if (alreadyReviewed) {
             throw new IllegalStateException("You have already reviewed this exchange.");
        }

        User reviewer = userRepository.findById(reviewerId).orElseThrow();
        User reviewee = userRepository.findById(revieweeId).orElseThrow();

        Review rev = new Review();
        rev.setExchange(ex);
        rev.setReviewer(reviewer);
        rev.setReviewee(reviewee);
        rev.setScore(score);
        rev.setComment(comment);
        
        Review savedReview = reviewRepository.save(rev);
        
        // Update user average rating
        double newAvg = reviewRepository.findAll().stream()
            .filter(r -> r.getReviewee().getId().equals(revieweeId))
            .mapToInt(Review::getScore)
            .average().orElse(score);
        reviewee.setAverageRating(newAvg);
        userRepository.save(reviewee);
        
        return savedReview;
    }

    @Transactional
    public Exchange scheduleSession(Long exchangeId, String meetingLink, LocalDateTime scheduledTime) {
        Exchange ex = exchangeRepository.findById(exchangeId).orElseThrow();
        ex.setMeetingLink(meetingLink);
        ex.setScheduledTime(scheduledTime);
        return exchangeRepository.save(ex);
    }

    public java.util.List<ExchangeMessage> getMessages(Long exchangeId) {
        return exchangeMessageRepository.findByExchangeIdOrderBySentAtAsc(exchangeId);
    }

    @Transactional
    public ExchangeMessage sendMessage(Long exchangeId, Long senderId, String content) {
        Exchange ex = exchangeRepository.findById(exchangeId).orElseThrow();
        User sender = userRepository.findById(senderId).orElseThrow();
        
        ExchangeMessage msg = new ExchangeMessage();
        msg.setExchange(ex);
        msg.setSender(sender);
        msg.setContent(content);
        msg.setSentAt(LocalDateTime.now());
        
        return exchangeMessageRepository.save(msg);
    }
}
