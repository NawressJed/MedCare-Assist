package com.example.services;

import com.example.dto.UserDetailsImpl;
import com.example.dto.request.AuthenticationRequest;
import com.example.dto.response.AuthenticationResponse;
import com.example.config.JwtService;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.*;
import com.example.enums.ERole;
import com.example.enums.TokenType;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.DoctorRepository;
import com.example.repositories.PatientRepository;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.tokensServices.ConfirmationTokenService;
import com.example.services.tokensServices.RefreshTokenService;
import com.example.services.tokensServices.ResetPasswordTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    UserRepository repository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    ResetPasswordTokenService passwordTokenService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    AutoPatientMapper autoPatientMapper;
    @Autowired
    ConfirmationTokenService confirmationTokenService;
    @Autowired
    RefreshTokenService refreshTokenService;
    @Autowired
    AutoDoctorMapper autoDoctorMapper;
    @Autowired
    AutoUserMapper autoUserMapper;
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final EmailSenderService emailSenderService;
    private final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    public AuthenticationResponse register(PatientDTO request) {
        try {
            Patient patient = autoPatientMapper.toEntity(request);
            if (repository.existsByEmail(patient.getEmail())){
                logger.error("ERROR: Email already in use!");
                return null;
            }else {
                patient.setRole(ERole.ROLE_PATIENT);
                patient.setPassword(passwordEncoder.encode(patient.getPassword()));
                repository.save(patient);
                var jwtToken = jwtService.generateToken(autoUserMapper.toDto(patient));
                Token confirmToken = confirmationTokenService.generateConfirmToken(autoUserMapper.toDto(patient));


                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(patient.getEmail());
                mailMessage.setSubject("Complete Registration!");
                mailMessage.setFrom("medcareassist1@gmail.com");
                mailMessage.setText("To confirm your account, please click here: "
                        + "http://localhost:8081/auth/confirm-account?token=" + confirmToken.getToken());

                emailSenderService.sendEmail(mailMessage);

                return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .build();
            }
        } catch (MailException ex) {
                logger.error("ERROR: Sending email!"+ ex);
                throw new RuntimeException(ex);
        }
    }

    public AuthenticationResponse register(DoctorDTO request) {
        try {
            Doctor doctor = autoDoctorMapper.toEntity(request);
            if (repository.existsByEmail(doctor.getEmail())) {
                logger.error("ERROR: Email already in use!");
                return null;
            } else {
                doctor.setRole(ERole.ROLE_DOCTOR);
                doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
                repository.save(doctor);
                var jwtToken = jwtService.generateToken(autoUserMapper.toDto(doctor));
                Token confirmToken = confirmationTokenService.generateConfirmToken(autoUserMapper.toDto(doctor));

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(doctor.getEmail());
                mailMessage.setSubject("Complete Registration!");
                mailMessage.setFrom("medcareassist1@gmail.com");
                mailMessage.setText("To confirm your account, please click here: "
                        + "http://localhost:8081/auth/confirm-account?token=" + confirmToken.getToken());

                emailSenderService.sendEmail(mailMessage);
                return AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .build();
            }
        } catch (MailException ex) {
            logger.error("ERROR: Sending email! " + ex.getMessage(), ex); // Detailed error logging
            return null;
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        UserEntity user = repository.findByEmail(request.getEmail());

        Token confirmToken = tokenRepository.findByUserAndTokenType(user, TokenType.CONFIRM_ACCOUNT);
        if (confirmToken != null) {
            throw new RuntimeException("Account is not confirmed yet!");
        } else {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var jwtToken = jwtService.generateToken(autoUserMapper.toDto(user));
            var refreshToken = refreshTokenService.generateRefreshToken(autoUserMapper.toDto(user));

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken.getToken())
                    .user(user)
                    .build();
        }
    }

    public AuthenticationResponse refreshAccessToken(String refreshToken) {
        Token verifiedToken = refreshTokenService.verifyExpiration(refreshToken);
        UserEntity userEntity = verifiedToken.getUser();

        String newAccessToken = jwtService.generateToken(autoUserMapper.toDto(userEntity));

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void requestResetPassword(String email) {
        try {
            UserEntity user = repository.findByEmail(email);
            if (user == null) {
                logger.error("ERROR: Email does not exist!");
            } else if (tokenRepository.existsByUserAndTokenType(user, TokenType.RESET_PASSWORD)) {
                logger.error("ERROR: Link is already sent!");
            } else {
                Token token = passwordTokenService.generateResetPasswordToken(autoUserMapper.toDto(user));

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(user.getEmail());
                mailMessage.setSubject("Reset Password!");
                mailMessage.setFrom("medcareassist1@gmail.com");
                mailMessage.setText("To reset your password, please click here: "
                        + "http://localhost:4200/reset-password?token=" + token.getToken());

                emailSenderService.sendEmail(mailMessage);
            }
        } catch (MailException ex) {
            logger.error("ERROR: Sending request! " + ex);
        }
    }

    public void changePassword(UserEntity user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }

    public boolean oldPasswordIsValid(UserEntity user, String oldPassword){
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    public PatientDTO updatePatient(UUID id, Patient patientDTO) {
        try {
            Patient patient = patientRepository.findPatientById(id);
            patientDTO.setRole(ERole.ROLE_PATIENT);
            patientDTO.setMyDoctors(patient.getMyDoctors());
            patientDTO.setPassword(patient.getPassword());
            return autoPatientMapper.toDto(repository.save(patient));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public DoctorDTO updateDoctor(UUID id, Doctor doctor) {
        try {
            Doctor doctor1 = doctorRepository.findDoctorById(id);
            doctor.setPassword(doctor1.getPassword());
            doctor.setRole(ERole.ROLE_DOCTOR);
            doctor.setMyPatients(doctor1.getMyPatients());
            return autoDoctorMapper.toDto(repository.save(doctor));
        } catch (Exception e) {
            logger.error("ERROR updating doc with id = "+ id);
            throw new RuntimeException(e);
        }
    }

    public void logout(Token refreshToken) {
            tokenRepository.delete(refreshToken);
    }
}
