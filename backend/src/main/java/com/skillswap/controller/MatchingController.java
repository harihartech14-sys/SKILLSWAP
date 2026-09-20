package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.service.MatchingService;
import com.skillswap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
@CrossOrigin("*")
@RequiredArgsConstructor
public class MatchingController {
    private final MatchingService matchingService;
    private final UserService userService;

    @GetMapping("/{userAId}/{userBId}")
    public int getMatchPercentage(@PathVariable Long userAId, @PathVariable Long userBId) {
        User userA = userService.findById(userAId).orElseThrow();
        User userB = userService.findById(userBId).orElseThrow();
        return matchingService.calculateMatchPercentage(userA, userB);
    }
}
