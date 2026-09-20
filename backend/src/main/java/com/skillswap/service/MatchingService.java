package com.skillswap.service;

import com.skillswap.model.SkillType;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {
    private final UserSkillRepository userSkillRepository;

    public int calculateMatchPercentage(User userA, User userB) {
        List<UserSkill> aSkills = userSkillRepository.findByUserId(userA.getId());
        List<UserSkill> bSkills = userSkillRepository.findByUserId(userB.getId());

        List<Long> aLearn = aSkills.stream().filter(s -> s.getSkillType() == SkillType.LEARN).map(s -> s.getSkill().getId()).collect(Collectors.toList());
        List<Long> aTeach = aSkills.stream().filter(s -> s.getSkillType() == SkillType.TEACH).map(s -> s.getSkill().getId()).collect(Collectors.toList());
        List<Long> bLearn = bSkills.stream().filter(s -> s.getSkillType() == SkillType.LEARN).map(s -> s.getSkill().getId()).collect(Collectors.toList());
        List<Long> bTeach = bSkills.stream().filter(s -> s.getSkillType() == SkillType.TEACH).map(s -> s.getSkill().getId()).collect(Collectors.toList());

        boolean aWantsB = aLearn.stream().anyMatch(bTeach::contains);
        boolean bWantsA = bLearn.stream().anyMatch(aTeach::contains);

        if (aWantsB && bWantsA) {
            return 95; // Mutual
        } else if (aWantsB || bWantsA) {
            return 50; // One-way
        }
        return 0; // No overlap
    }
}
