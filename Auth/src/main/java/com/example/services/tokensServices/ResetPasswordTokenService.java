package com.example.services.tokensServices;

import com.example.dto.UserDetailsImpl;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ResetPasswordTokenService {

    @Autowired
    AutoUserMapper autoUserMapper;
    @Autowired
    TokenRepository tokenRepository;

    public Token generateResetPasswordToken(UserDetailsImpl userDetails) {
        Token resetpassToken = new Token();

        resetpassToken.setTokenType(TokenType.RESET_PASSWORD);
        resetpassToken.setToken(UUID.randomUUID().toString());
        resetpassToken.setUser(autoUserMapper.toEntity(userDetails));

        return tokenRepository.save(resetpassToken);
    }
}
