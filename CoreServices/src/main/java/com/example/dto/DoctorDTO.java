package com.example.dto;

import com.example.entities.Patient;
import com.example.enums.ESpecialty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO extends UserDTO{
    private String workPhoneNumber;
    private float consultationPrice;
    @Enumerated(EnumType.STRING)
    private ESpecialty specialty;
    @ManyToMany
    private Set<Patient> myPatients;
}
