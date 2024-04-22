package com.example.repositories;

import com.example.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Doctor findDoctorById(UUID id);
}
