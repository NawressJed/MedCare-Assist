package com.example.dto;

import com.example.entities.MedicalFile;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicationDTO {
    private UUID id;
    private String name;
    private String dosage;
    private String frequency;
    private String duration;
}
