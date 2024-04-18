package com.example.entities;

import com.example.enums.TokenType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    private String token;
    @Enumerated(EnumType.STRING)
    private TokenType tokenType;
    private Date expiresAt;
    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;

    public Token(String token, UserEntity user) {
        this.token = token;
        this.user = user;
    }
}
