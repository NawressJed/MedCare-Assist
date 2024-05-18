package com.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "medicalFile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalFile {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;
    private LocalDateTime date;
    private String description;
    private String disease;
    @ManyToOne
    @JoinColumn(nullable = false, name = "patient_id")
    private Patient patient;
    @ManyToOne
    @JoinColumn(nullable = false, name = "doctor_id")
    private Doctor doctor;
}
