package com.example.medcareassist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@PropertySource("application.properties")
@PropertySource("application-security.properties")
public class MedCareAssistApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedCareAssistApplication.class, args);
    }

}
