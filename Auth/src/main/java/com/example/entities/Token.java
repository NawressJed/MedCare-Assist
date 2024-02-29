package com.example.entities;

import com.example.dto.PatientDTO;
import com.example.enums.TokenType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

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
    @OneToOne(targetEntity = UserEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;


    public Token(String token, TokenType tokenType) {
        this.token = token;
        this.tokenType = tokenType;
    }

    public Token(String token, TokenType tokenType, Date expiresAt) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
    }

    public Token(UserEntity user) {
        this.user = user;
    }
}
