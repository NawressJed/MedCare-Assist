package com.example.auth;

import com.example.config.JwtService;
import com.example.dto.PatientDTO;
import com.example.entities.Patient;
import com.example.entities.Token;
import com.example.enums.ERole;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.PatientService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    PatientService patientService;
    @Autowired
    UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    @Autowired
    AutoPatientMapper autoPatientMapper;
    private final AuthenticationManager authenticationManager;
    private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    public AuthenticationResponse register(PatientDTO request) {
        request.setRole(ERole.PATIENT);
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        repository.save(autoPatientMapper.toEntity(request));
//        patientService.createPatient(request);
        var jwtToken = jwtService.generateToken(request);
        var refreshToken = jwtService.generateRefreshToken(request);
        Token token = new Token(jwtToken);
        tokenRepository.save(token);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
