package com.example.services;

import com.example.dto.PatientDTO;
import org.springframework.http.ResponseEntity;

import java.sql.Blob;
import java.util.List;
import java.util.UUID;

public interface PatientService {

    PatientDTO createPatient(PatientDTO patientDTO);

    List<PatientDTO> getAllPatients();

    PatientDTO findPatientById(UUID id);
    PatientDTO findPatientByEmail(String email);

    void deletePatient(UUID id);

    PatientDTO updatePatient(PatientDTO patientDTO);

}
