package com.example.dto;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalFileDTO {
    private UUID id;
    private LocalDateTime date;
    private String description;
    private String disease;
    @ManyToOne
    private Patient patient;
    @ManyToOne
    private Doctor doctor;
}
