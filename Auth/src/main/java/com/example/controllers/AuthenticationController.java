package com.example.controllers;

import com.example.dto.ForgetPassword;
import com.example.dto.request.AuthenticationRequest;
import com.example.dto.response.AuthenticationResponse;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.ResetPassword;
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

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ForgetPassword forgetPassword) {
        try {
            authenticationService.requestResetPassword(forgetPassword);
            return ResponseEntity.ok().body(Map.of("message", "Password reset request successful"));
        } catch (Exception e) {
            log.error("Error resetting password", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Error resetting password"));
        }
    }

    @GetMapping("/reset-password-request")
    public ResponseEntity<String> requestResetPassword(@RequestParam("token") String token) {
        Token resetPasswordToken = tokenRepository.findByToken(token);
        if (resetPasswordToken == null) {
            return ResponseEntity.badRequest().body("Invalid reset password token");
        }

        UserEntity user = resetPasswordToken.getUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        tokenRepository.delete(resetPasswordToken);
        return ResponseEntity.ok("Password reset request successfully");
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<String> validateResetToken(@RequestParam("token") String token) {
        Token resetPasswordToken = tokenRepository.findByToken(token);
        if (resetPasswordToken == null || resetPasswordToken.getTokenType() != TokenType.RESET_PASSWORD) {
            return ResponseEntity.badRequest().body("Invalid reset password token");
        }
        return ResponseEntity.ok("Reset password token is valid");
    }

    @PostMapping("/update-password")
    public ResponseEntity<Map<String, String>> updatePassword(@RequestParam("token") String token, @RequestBody ResetPassword resetPassword) {

        try {
            Token resetToken = tokenRepository.findByTokenAndTokenType(token, TokenType.RESET_PASSWORD);
            if(!tokenRepository.existsByUserAndTokenType(resetToken.getUser(), TokenType.RESET_PASSWORD)){
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid reset password token");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            authenticationService.changePassword(resetToken.getUser(), resetPassword.getNewPassword());
            /*Token refreshToken = tokenRepository.findByUserAndTokenType(resetToken.getUser(), TokenType.REFRESH_TOKEN);
        if (tokenRepository.existsByUserAndTokenType(refreshToken.getUser(), TokenType.REFRESH_TOKEN)) {
            tokenRepository.delete(refreshToken);
        }*/
            tokenRepository.delete(resetToken);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Password updated successfully");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            log.error("Error updating password", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error updating password");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
