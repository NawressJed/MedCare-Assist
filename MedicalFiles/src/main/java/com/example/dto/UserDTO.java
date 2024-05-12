package com.example.dto;

import com.example.enums.EGender;
import com.example.enums.ERole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String address;
    private String zipCode;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private EGender gender;
    @Enumerated(EnumType.STRING)
    private ERole role;
}
