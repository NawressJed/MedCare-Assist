package com.example.config;

import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.dto.UserDetailsImpl;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;
    @Autowired
    AutoUserMapper autoUserMapper;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    UserRepository userRepository;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Token findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void removeToken(Token token){
        tokenRepository.delete(token);
    }

    public String generateToken(UserDetailsImpl userDetails) {
        UserEntity user = autoUserMapper.toEntity(userDetails);
        Map<String, Object> claims = new HashMap<>();
        claims.put("firstname", user.getFirstname());
        claims.put("role", user.getRole().name());

        return generateToken(claims, autoUserMapper.toDto(user));
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

//    public String generateRefreshToken(UserDetailsImpl userDetails) {
//        UserEntity user = autoUserMapper.toEntity(userDetails);
//
//        return generateToken(new HashMap<>(), autoUserMapper.toDto(user));
//    }


    public Token generateRefreshToken(UserDetailsImpl userDetails) {
        Token refreshToken = new Token();

        refreshToken.setTokenType(TokenType.REFRESH_TOKEN);
        refreshToken.setExpiresAt(new Date(System.currentTimeMillis() + refreshExpiration));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(autoUserMapper.toEntity(userDetails));

        return refreshToken;
    }

    public Token generateConfirmToken(UserDetailsImpl userDetails) {
        Token confirmToken = new Token();

        confirmToken.setTokenType(TokenType.CONFIRM_ACCOUNT);
        confirmToken.setToken(UUID.randomUUID().toString());
        confirmToken.setUser(autoUserMapper.toEntity(userDetails));

        return confirmToken;
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
