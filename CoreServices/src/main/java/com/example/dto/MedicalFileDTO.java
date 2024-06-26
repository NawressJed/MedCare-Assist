package com.example.dto;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.ESeverity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalFileDTO {
    private UUID id;
    private LocalDateTime date;
    private String description;
    private String disease;
    @Enumerated(EnumType.STRING)
    private ESeverity severity;
    @ManyToOne
    private Patient patient;
    @ManyToOne
    private Doctor doctor;
    private List<MedicationDTO> medications;
}
