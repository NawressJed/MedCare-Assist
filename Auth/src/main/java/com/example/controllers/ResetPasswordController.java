package com.example.controllers;

import com.example.entities.ResetPassword;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.ResetPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class ResetPasswordController {
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    ResetPasswordService passwordService;
    @Autowired
    UserRepository userRepository;


    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPassword resetPassword) {
        passwordService.requestResetPassword(resetPassword);
        return ResponseEntity.ok("jawk behi");
    }

    @GetMapping("/request")
    public ResponseEntity<String> requestResetPassword(@RequestParam("token") String token) {
        Token resetPasswordToken = tokenRepository.findByToken(token);
        if (resetPasswordToken == null) {
            return ResponseEntity.badRequest().body("Invalid reset password token");
        }
        return ResponseEntity.ok("Password reset request successfully");
    }

    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody ResetPassword resetPassword) {
        UserEntity user = userRepository.findByEmail(resetPassword.getEmail());
        Token resetPasswordToken = tokenRepository.findByUserAndTokenType(user, TokenType.REFRESH_TOKEN);

        if (!passwordService.oldPasswordIsValid(user, resetPassword.getOldPassword())){
            return ResponseEntity.ok("Incorrect old password");
        }
        passwordService.changePassword(user, resetPassword.getNewPassword());
        tokenRepository.delete(resetPasswordToken);

        return ResponseEntity.ok("Password has been updated successfully");
    }
}
