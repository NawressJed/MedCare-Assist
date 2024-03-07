package com.example.controllers;

import com.example.dto.UserDetailsImpl;
import com.example.dto.request.AuthenticationRequest;
import com.example.dto.response.AuthenticationResponse;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.ResetPassword;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.AuthenticationService;
import com.example.services.EmailSenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Autowired
    UserRepository repository;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    EmailSenderService mailSender;
    @Autowired
    AutoUserMapper autoUserMapper;

    @PostMapping("/patient_register")
    public ResponseEntity<AuthenticationResponse> register (
            @RequestBody PatientDTO request
    ) throws Exception {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/doctor_register")
    public ResponseEntity<AuthenticationResponse> register (
            @RequestBody DoctorDTO request
    ) throws Exception {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public AuthenticationResponse authenticate (
            @RequestBody AuthenticationRequest request
    ) {
        return authenticationService.authenticate(request);
    }

    @GetMapping("/confirm-account")
     public ResponseEntity<String> confirmAccount(@RequestParam("token") String token) {
        Token confirmToken = tokenRepository.findByToken(token);
        if (confirmToken == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        UserEntity user = confirmToken.getUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        repository.save(user);
        tokenRepository.delete(confirmToken);

        return ResponseEntity.ok("Account confirmed successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPassword resetPassword) {
        try {
            authenticationService.requestResetPassword(resetPassword);
            return ResponseEntity.ok("jawk behi");
        } catch (Exception e) {
            log.error(e);
            return null;
        }
    }

    @GetMapping("/reset-password-request")
    public ResponseEntity<String> requestResetPassword(@RequestParam("token") String token) {
        Token resetPasswordToken = tokenRepository.findByToken(token);
        if (resetPasswordToken == null) {
            return ResponseEntity.badRequest().body("Invalid reset password token");
        }
        return ResponseEntity.ok("Password reset request successfully");
    }

    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody ResetPassword resetPassword) {
        UserEntity user = repository.findByEmail(resetPassword.getEmail());
        Token refreshToken = tokenRepository.findByUserAndTokenType(user, TokenType.REFRESH_TOKEN);

        if (authenticationService.newPasswordIsValid(user, resetPassword.getNewPassword())){
            return ResponseEntity.ok("Same old password!");
        }
        authenticationService.changePassword(user, resetPassword.getNewPassword());
        tokenRepository.delete(refreshToken);

        return ResponseEntity.ok("Password has been updated successfully");
    }
}
