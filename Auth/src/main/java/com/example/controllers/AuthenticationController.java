package com.example.controllers;

import com.example.dto.request.AuthenticationRequest;
import com.example.dto.response.AuthenticationResponse;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.AuthenticationService;
import com.example.services.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    @Autowired
    UserRepository repository;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    EmailSenderService mailSender;

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
    public ResponseEntity<AuthenticationResponse> authenticate (
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
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

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account is already confirmed");
        }

        user.setEnabled(true);
        repository.save(user);
        tokenRepository.delete(confirmToken);

        return ResponseEntity.ok("Account confirmed successfully");
    }
}
