package com.example.repositories;

import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {
    Token findByToken(String token);
    Token removeByToken(String token);

    Token findByUserAndTokenType(UserEntity userId, TokenType tokenType);
}
