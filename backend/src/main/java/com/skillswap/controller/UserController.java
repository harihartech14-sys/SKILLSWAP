package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PutMapping("/{id}")
    public User editProfile(@PathVariable Long id, @RequestBody User user) {
        return userService.editProfile(id, user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id).orElse(null);
    }

    @GetMapping
    public java.util.List<User> getAllUsers() {
        return userService.findAll();
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody User loginUser) {
        java.util.Optional<User> userOpt = userService.findAll().stream()
            .filter(u -> u.getUsername().equals(loginUser.getUsername()) && u.getPassword().equals(loginUser.getPassword()))
            .findFirst();
        
        if (userOpt.isPresent()) {
            return org.springframework.http.ResponseEntity.ok(userOpt.get());
        } else {
            return org.springframework.http.ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid username or password"));
        }
    }
}
