package com.example.services.tokensServices;

import com.example.dto.UserDetailsImpl;
import com.example.entities.Token;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ConfirmationTokenService {

    @Autowired
    AutoUserMapper autoUserMapper;
    @Autowired
    TokenRepository tokenRepository;

    public Token generateConfirmToken(UserDetailsImpl userDetails) {
        Token confirmToken = new Token();

        confirmToken.setTokenType(TokenType.CONFIRM_ACCOUNT);
        confirmToken.setToken(UUID.randomUUID().toString());
        confirmToken.setUser(autoUserMapper.toEntity(userDetails));

        return tokenRepository.save(confirmToken);
    }
}
