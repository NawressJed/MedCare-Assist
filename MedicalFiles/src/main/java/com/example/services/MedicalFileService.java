package com.example.services;

import com.example.dto.MedicalFileDTO;
import com.example.entities.MedicalFile;

import java.util.List;
import java.util.UUID;

public interface MedicalFileService {
    MedicalFileDTO createMedicalFile(MedicalFileDTO medicalFileDTO);
    MedicalFileDTO getMedicalFileByID(UUID id);
    List<MedicalFileDTO> getDoctorMedicalFiles(UUID id);
    List<MedicalFileDTO> getPatientMedicalFiles(UUID id);
    List<MedicalFileDTO> getAllMedicalFiles();
    MedicalFileDTO updateMedicalFile(MedicalFileDTO medicalFileDTO);
    void deleteMedicalFile(UUID id);
}
