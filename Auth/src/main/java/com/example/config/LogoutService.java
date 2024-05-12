package com.example.config;

import com.example.dto.UserDetailsImpl;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    AutoUserMapper mapper;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            return;
        }
//        jwt = authHeader.substring(7);
//        var storedToken = tokenRepository.findByToken(jwt);

         authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("User not authenticated, cannot logout");
            return;
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        UserEntity user = mapper.toEntity(userDetails);

        var refreshToken = tokenRepository.findByUserAndTokenType(user, TokenType.REFRESH_TOKEN);

        if (refreshToken == null) {
            System.out.println("Refresh token not found for deletion");
            return;
        }

        tokenRepository.delete(refreshToken);
        System.out.println("Refresh token deleted for user: " + userDetails.getUsername());


        System.out.println("jawk behi");
        }
}
