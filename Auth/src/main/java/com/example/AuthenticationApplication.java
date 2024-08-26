package com.example;

import com.example.entities.Admin;
import com.example.entities.UserEntity;
import com.example.enums.ERole;
import com.example.repositories.AdminRepository;
import com.example.repositories.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthenticationApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(AuthenticationApplication.class, args);
        AdminRepository userRepository = context.getBean(AdminRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        Admin admin = userRepository.findAdminByEmail("admin12@mail.com");
        if (admin == null) {
            Admin newAdmin = new Admin();
            newAdmin.setEmail("admin12@mail.com");
            newAdmin.setPassword(passwordEncoder.encode("medcare1245"));
            newAdmin.setRole(ERole.ROLE_ADMIN);
            newAdmin.setAdmin(true);
            userRepository.save(newAdmin);
        }
    }

}