package com.example.services;

import com.example.dto.UserDetailsImpl;
import com.example.entities.Token;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;
    @Autowired
    AutoUserMapper autoUserMapper;
    @Autowired
    TokenRepository tokenRepository;

    public Token generateRefreshToken(UserDetailsImpl userDetails) {
        Token refreshToken = new Token();

        refreshToken.setTokenType(TokenType.REFRESH_TOKEN);
        refreshToken.setExpiresAt(new Date(System.currentTimeMillis() + refreshExpiration));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(autoUserMapper.toEntity(userDetails));

        return tokenRepository.save(refreshToken);
    }
}
