package com.skillswap.service;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User registerUser(User user) {
        user.setCredits(5);
        return userRepository.save(user);
    }

    public User editProfile(Long userId, User updatedData) {
        return userRepository.findById(userId).map(user -> {
            if (updatedData.getName() != null) user.setName(updatedData.getName());
            if (updatedData.getBio() != null) user.setBio(updatedData.getBio());
            if (updatedData.getQualification() != null) user.setQualification(updatedData.getQualification());
            if (updatedData.getInstitution() != null) user.setInstitution(updatedData.getInstitution());
            if (updatedData.getYear() != null) user.setYear(updatedData.getYear());
            user.setProfilePicUrl(updatedData.getProfilePicUrl());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAll();
    }
}
