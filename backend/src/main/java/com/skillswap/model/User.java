package com.skillswap.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "app_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String profilePicUrl;

    private String bio;

    private String qualification;

    private String institution;

    @Column(name = "graduation_year")
    private Integer year;

    private Double averageRating;

    private Integer credits;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSkill> userSkills;
}
