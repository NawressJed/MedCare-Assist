package com.example.controllers;

import com.example.config.JwtService;
import com.example.dto.UserDetailsImpl;
import com.example.dto.request.AuthenticationRequest;
import com.example.dto.request.TokenRequest;
import com.example.dto.request.UpdatePassword;
import com.example.dto.response.AuthenticationResponse;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.request.ResetPassword;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.AuthenticationService;
import com.example.services.EmailSenderService;
import com.example.services.UserDetailsServiceImpl;
import com.example.services.tokensServices.RefreshTokenService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Log4j2
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Autowired
    UserRepository repository;
    @Autowired
    RefreshTokenService refreshTokenService;
    @Autowired
    UserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtService jwtService;
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

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body("Refresh token is missing");
        }

        try {
            Token verifiedToken = refreshTokenService.verifyExpiration(refreshToken);
            UserEntity userEntity = verifiedToken.getUser();
            UserDetailsImpl userDetails = autoUserMapper.toDto(userEntity);
            String newAccessToken = jwtService.generateToken(userDetails);
            Token newRefreshToken = refreshTokenService.generateRefreshToken(userDetails);

            tokenRepository.delete(verifiedToken);
            tokenRepository.save(newRefreshToken);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token has expired");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
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
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam("email") String email) {
        try {
            authenticationService.requestResetPassword(email);
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

    @PutMapping("/account/update/patient/{id}")
    public ResponseEntity<Map<String, String>> updatePatient(@PathVariable(value = "id") UUID id, @RequestBody Patient patient) {
        PatientDTO patientDTO = authenticationService.updatePatient(id, patient);
        userDetailsService.updateLoggedUser(patientDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Patient account details have been updated.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/account/update/doctor/{id}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public ResponseEntity<Map<String, String>> updateDoctor(@PathVariable(value = "id") UUID id,
                                                            @RequestBody Doctor doctor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Authenticated user: {}", authentication.getPrincipal());
        log.info("User roles: {}", authentication.getAuthorities());

        DoctorDTO updatedUser = authenticationService.updateDoctor(id, doctor);
        userDetailsService.updateLoggedUser(updatedUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Doctor account details have been updated.");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/change-password/{id}")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable(value = "id") UUID id, @RequestBody UpdatePassword resetPassword) {
        UserEntity user = repository.findUserEntityById(id);
        if (!authenticationService.oldPasswordIsValid(user, resetPassword.getOldPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect old password"));
        }
        authenticationService.changePassword(user, resetPassword.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        Token refresh_token = tokenRepository.findByToken(refreshToken);
        if (refresh_token != null) {
            authenticationService.logout(refresh_token);
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
        } else {
            return ResponseEntity.badRequest().body("Invalid refresh token");
        }
    }
}
