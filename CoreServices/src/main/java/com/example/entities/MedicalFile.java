package com.example.entities;

import com.example.enums.ESeverity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
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
    @Enumerated(EnumType.STRING)
    private ESeverity severity;
    @ManyToOne
    @JoinColumn(nullable = false, name = "patient_id")
    private Patient patient;
    @ManyToOne
    @JoinColumn(nullable = false, name = "doctor_id")
    private Doctor doctor;
    @OneToMany(mappedBy = "medicalFile", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Medication> medications;
}
