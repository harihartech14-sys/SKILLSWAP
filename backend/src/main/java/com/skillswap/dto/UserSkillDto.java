package com.skillswap.dto;

import lombok.Data;
import com.skillswap.model.SkillType;

@Data
public class UserSkillDto {
    private String skillName;
    private SkillType skillType;
}
