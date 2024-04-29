package com.example.services;

import com.example.dto.PatientDTO;
import com.example.entities.Patient;

import java.util.List;

public interface PatientService {
    List<PatientDTO> getAllPatients();
}
