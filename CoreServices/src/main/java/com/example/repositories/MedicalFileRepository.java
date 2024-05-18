package com.example.repositories;

import com.example.entities.MedicalFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MedicalFileRepository extends JpaRepository<MedicalFile, UUID> {
    MedicalFile findMedicalFileById(UUID id);
    @Query(value = "SELECT m.* FROM medical-file AS m WHERE m.doctor_id = :id ", nativeQuery = true)
    List<MedicalFile> getMedicalFileByDoctor(UUID id);

    @Query(value = "SELECT m.* FROM medical-file AS m WHERE m.patient_id = :id ", nativeQuery = true)
    List<MedicalFile> getMedicalFileByPatient(UUID id);
}
