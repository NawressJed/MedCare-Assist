package com.example.repositories;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.ESpecialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    @Query(value = "SELECT * FROM user u WHERE u.email = :email", nativeQuery = true)
    Doctor findByEmail(String email);
    @Query(value = "SELECT p FROM Patient p JOIN p.myDoctors d WHERE d.id = :doctorId")
    Set<Patient> findPatientsByDoctorId(UUID doctorId);
    Doctor findDoctorById(UUID id);
    @Query(value = "SELECT COUNT(DISTINCT p.patient_id) FROM patients_doctors AS p WHERE p.doctor_id = :doctorId", nativeQuery = true)
    int countTotalPatientsByDoctorId(UUID doctorId);

    @Query("SELECT d FROM Doctor d WHERE d.specialty = :specialty")
    List<Doctor> findBySpecialty(ESpecialty specialty);
}
