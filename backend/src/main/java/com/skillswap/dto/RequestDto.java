package com.skillswap.dto;

import lombok.Data;

@Data
public class RequestDto {
    private Long requesterId;
    private Long receiverId;
    private Long offeredSkillId;
    private Long requestedSkillId;
}
