package com.example.repositories;

import com.example.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    @Query(value = "SELECT * FROM user u WHERE u.email = :email", nativeQuery = true)
    Doctor findByEmail(String email);

    Doctor findDoctorById(UUID id);
}