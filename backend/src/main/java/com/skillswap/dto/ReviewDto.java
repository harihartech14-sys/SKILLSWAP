package com.skillswap.dto;

import lombok.Data;

@Data
public class ReviewDto {
    private Long reviewerId;
    private Long revieweeId;
    private Integer score;
    private String comment;
}
