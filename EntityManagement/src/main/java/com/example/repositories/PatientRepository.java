package com.example.repositories;

import com.example.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    @Query(value = "SELECT * FROM user u WHERE u.email = :email", nativeQuery = true)
    Patient findByEmail(String email);
    void deleteByEmail(String email);
    Patient findPatientById(UUID id);
}
