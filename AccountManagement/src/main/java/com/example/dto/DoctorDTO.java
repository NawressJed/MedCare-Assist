package com.example.dto;

import com.example.enums.ESpecialty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO extends UserDTO{
    private String officeAddress;
    private float consultationPrice;
    @Enumerated(EnumType.STRING)
    private ESpecialty specialty;
}
