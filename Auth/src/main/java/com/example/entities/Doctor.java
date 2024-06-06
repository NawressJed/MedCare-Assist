package com.example.entities;

import com.example.enums.ESpecialty;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "userId")
public class Doctor extends UserEntity {
    private String workPhoneNumber;
    private float consultationPrice;
    @Enumerated(EnumType.STRING)
    private ESpecialty specialty;
    @ManyToMany
    @JoinTable(
            name = "patients_doctors",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id"))

    private Set<Patient> myPatients;
}
