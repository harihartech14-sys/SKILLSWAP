package com.skillswap.service;

import com.skillswap.model.Skill;
import com.skillswap.model.SkillType;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserSkill addUserSkill(Long userId, String skillName, SkillType skillType) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Skill skill = skillRepository.findByName(skillName).orElseGet(() -> {
            Skill newSkill = new Skill();
            newSkill.setName(skillName);
            return skillRepository.save(newSkill);
        });

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkill.setSkillType(skillType);
        return userSkillRepository.save(userSkill);
    }

    public void removeUserSkill(Long userSkillId) {
        userSkillRepository.deleteById(userSkillId);
    }
}
