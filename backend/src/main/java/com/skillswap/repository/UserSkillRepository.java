package com.skillswap.repository;

import com.skillswap.model.UserSkill;
import com.skillswap.model.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    List<UserSkill> findBySkillId(Long skillId);
    List<UserSkill> findBySkillType(SkillType skillType);
    List<UserSkill> findByUserIdAndSkillType(Long userId, SkillType skillType);
    List<UserSkill> findBySkillIdAndSkillType(Long skillId, SkillType skillType);
}
