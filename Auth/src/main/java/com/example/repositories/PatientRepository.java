package com.example.repositories;

import com.example.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findPatientByEmail(String email);
}
