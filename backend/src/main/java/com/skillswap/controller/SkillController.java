package com.skillswap.controller;

import com.skillswap.dto.UserSkillDto;
import com.skillswap.model.UserSkill;
import com.skillswap.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;

    @PostMapping("/user/{userId}")
    public UserSkill addUserSkill(@PathVariable Long userId, @RequestBody UserSkillDto dto) {
        return skillService.addUserSkill(userId, dto.getSkillName(), dto.getSkillType());
    }

    @DeleteMapping("/user-skill/{id}")
    public void removeUserSkill(@PathVariable Long id) {
        skillService.removeUserSkill(id);
    }
}
