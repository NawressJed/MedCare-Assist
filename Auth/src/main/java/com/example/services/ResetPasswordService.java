package com.example.services;

import com.example.entities.ResetPassword;
import com.example.entities.Token;
import com.example.entities.UserEntity;
import com.example.enums.TokenType;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.TokenRepository;
import com.example.repositories.UserRepository;
import com.example.services.tokensServices.ResetPasswordTokenService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResetPasswordService {
    @Autowired
    ResetPasswordTokenService passwordTokenService;
    @Autowired
    private final EmailSenderService emailSenderService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AutoUserMapper autoUserMapper;
    private final Logger logger = LoggerFactory.getLogger(ResetPasswordService.class);
    @Autowired
    PasswordEncoder passwordEncoder;

    public void requestResetPassword(ResetPassword resetPassword) {
        UserEntity user = null;
        try {
            user = userRepository.findByEmail(resetPassword.getEmail());
            if (!userRepository.existsByEmail(user.getEmail())){
                logger.error("ERROR: Email does not exist!");
            }else {
                Token token = passwordTokenService.generateResetPasswordToken(autoUserMapper.toDto(user));


                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(user.getEmail());
                mailMessage.setSubject("Reset Your Password!");
                mailMessage.setFrom("t99est97@gmail.com");
                mailMessage.setText("To reset your password, please click here: "
                        + "http://localhost:8080/api/password/request?token=" + token.getToken());

                emailSenderService.sendEmail(mailMessage);
            }
        } catch (MailException ex) {
            logger.error("ERROR: Sending request!"+ ex);
        }
    }


    public void changePassword(UserEntity user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public boolean oldPasswordIsValid(UserEntity user, String oldPassword){
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }
}

