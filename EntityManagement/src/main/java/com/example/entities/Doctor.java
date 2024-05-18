package com.example.entities;

import com.example.enums.ESpecialty;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "userId")
@EqualsAndHashCode(callSuper = true, exclude = "myPatients")
@ToString(callSuper = true, exclude = "myPatients")
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
    @JsonManagedReference
    private Set<Patient> myPatients;
}
