package com.example.repositories;

import com.example.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findPatientByEmail(String email);
    void deleteByEmail(String email);
    Patient findPatientById(UUID id);

    List<Patient> findByEmailContainingIgnoreCase(String email);
}
