package com.example.repositories;

import com.example.entities.Patient;
import com.example.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findPatientById(UUID id);
}
