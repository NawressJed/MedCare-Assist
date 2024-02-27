package com.example.auth;

import com.example.config.JwtService;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.ERole;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    @Autowired
    AutoPatientMapper autoPatientMapper;
    @Autowired
    AutoDoctorMapper autoDoctorMapper;
    @Autowired
    AutoUserMapper autoUserMapper;
    private final AuthenticationManager authenticationManager;
    private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    public AuthenticationResponse register(PatientDTO request) {
        Patient patient = autoPatientMapper.toEntity(request);
        if (repository.existsByEmail(patient.getEmail())){
            logger.error("ERROR: Email already in use!");
            return null;
        }else {
            request.setRole(ERole.PATIENT);
            request.setPassword(passwordEncoder.encode(request.getPassword()));
            repository.save(autoPatientMapper.toEntity(request));
            var jwtToken = jwtService.generateToken(request);
            var refreshToken = jwtService.generateRefreshToken(autoUserMapper.toDto(patient));
            var expired_at = jwtService.extractExpiration(jwtToken);
            Token token = new Token(jwtToken, refreshToken, expired_at);
            tokenRepository.save(token);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        }
    }

    public AuthenticationResponse register(DoctorDTO request) {
        Doctor doctor = autoDoctorMapper.toEntity(request);
        if (repository.existsByEmail(doctor.getEmail())){
            logger.error("ERROR: Email already in use!");
            return null;
        }else {
            request.setRole(ERole.DOCTOR);
            request.setPassword(passwordEncoder.encode(request.getPassword()));
            repository.save(autoDoctorMapper.toEntity(request));
            var jwtToken = jwtService.generateToken(request);
            var refreshToken = jwtService.generateRefreshToken(autoUserMapper.toDto(doctor));
            var expired_at = jwtService.extractExpiration(jwtToken);
            Token token = new Token(jwtToken, refreshToken, expired_at);
            tokenRepository.save(token);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .build();
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserEntity user = repository.findByEmail(request.getEmail());
        var jwtToken = jwtService.generateToken(autoUserMapper.toDto(user));
        var refreshToken = jwtService.generateRefreshToken(autoUserMapper.toDto(user));
        var expired_at = jwtService.extractExpiration(jwtToken);
        Token token = new Token(jwtToken, refreshToken, expired_at);
        tokenRepository.save(token);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
}
