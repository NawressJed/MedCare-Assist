package com.example.repositories;

import com.example.entities.Patient;
import com.example.enums.EGender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findPatientByEmail(String email);
    void deleteByEmail(String email);
    Patient findPatientById(UUID id);
    List<Patient> findByEmailContainingIgnoreCase(String email);
    @Query("SELECT COUNT(p) FROM Patient p JOIN p.myDoctors d WHERE d.id = :doctorId AND p.gender = 'MALE'")
    int countMalePatientsByDoctorId(UUID doctorId);

    @Query("SELECT COUNT(p) FROM Patient p JOIN p.myDoctors d WHERE d.id = :doctorId AND p.gender = 'FEMALE'")
    int countFemalePatientsByDoctorId(UUID doctorId);
}
