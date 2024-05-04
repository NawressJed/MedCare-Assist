package com.example.services;

import com.example.dto.PatientDTO;
import com.example.entities.Patient;
import com.example.entities.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface PatientService {
    PatientDTO getPatient(UUID id);
}
