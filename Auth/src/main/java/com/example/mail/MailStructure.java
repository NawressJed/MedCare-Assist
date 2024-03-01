package com.example.mail;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

@Data
public class MailStructure {
    @Value("${spring.mail.username}")
    private String from;
    private String to;
    private String subject;
    private String email;
    private String fromDisplayName;
    private String displayName;
    private String message;

}
