package com.skillswap.controller;

import com.skillswap.dto.RequestDto;
import com.skillswap.dto.ReviewDto;
import com.skillswap.model.Exchange;
import com.skillswap.model.Review;
import com.skillswap.model.SkillRequest;
import com.skillswap.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exchanges")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ExchangeController {
    private final ExchangeService exchangeService;

    @GetMapping("/requests/incoming/{userId}")
    public java.util.List<SkillRequest> getIncomingRequests(@PathVariable Long userId) {
        return exchangeService.getIncomingRequests(userId);
    }

    @GetMapping("/requests/sent/{userId}")
    public java.util.List<SkillRequest> getSentRequests(@PathVariable Long userId) {
        return exchangeService.getSentRequests(userId);
    }

    @GetMapping("/user/{userId}")
    public java.util.List<Exchange> getUserExchanges(@PathVariable Long userId) {
        return exchangeService.getUserExchanges(userId);
    }

    @PostMapping("/request")
    public SkillRequest createRequest(@RequestBody RequestDto dto) {
        return exchangeService.createRequest(dto.getRequesterId(), dto.getReceiverId(), dto.getOfferedSkillId(), dto.getRequestedSkillId());
    }

    @PostMapping("/request/{id}/accept")
    public Exchange acceptRequest(@PathVariable Long id) {
        return exchangeService.acceptRequest(id);
    }

    @PostMapping("/request/{id}/reject")
    public void rejectRequest(@PathVariable Long id) {
        exchangeService.rejectRequest(id);
    }

    @PostMapping("/{id}/complete")
    public Exchange completeExchange(@PathVariable Long id) {
        return exchangeService.completeExchange(id);
    }

    @PostMapping("/{id}/review")
    public Review addReview(@PathVariable Long id, @RequestBody ReviewDto dto) {
        return exchangeService.addReview(id, dto.getReviewerId(), dto.getRevieweeId(), dto.getScore(), dto.getComment());
    }

    @PostMapping("/{id}/schedule")
    public Exchange scheduleSession(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        String meetingLink = payload.get("meetingLink");
        String scheduledTimeStr = payload.get("scheduledTime");
        java.time.LocalDateTime scheduledTime = scheduledTimeStr != null ? java.time.LocalDateTime.parse(scheduledTimeStr) : null;
        return exchangeService.scheduleSession(id, meetingLink, scheduledTime);
    }

    @GetMapping("/{id}/messages")
    public java.util.List<com.skillswap.model.ExchangeMessage> getMessages(@PathVariable Long id) {
        return exchangeService.getMessages(id);
    }

    @PostMapping("/{id}/messages")
    public com.skillswap.model.ExchangeMessage sendMessage(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Long senderId = Long.parseLong(payload.get("senderId"));
        String content = payload.get("content");
        return exchangeService.sendMessage(id, senderId, content);
    }
}
