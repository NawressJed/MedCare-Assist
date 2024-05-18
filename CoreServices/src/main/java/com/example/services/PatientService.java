package com.example.services;

import com.example.dto.PatientDTO;

import java.util.List;
import java.util.UUID;

public interface PatientService {
    List<PatientDTO> getAllPatients();
    PatientDTO getPatient(UUID id);
}
