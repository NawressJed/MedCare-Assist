package com.example.services.impl;

import com.example.dto.PatientDTO;
import com.example.entities.Patient;
import com.example.entities.Token;
import com.example.enums.ERole;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.repositories.TokenRepository;
import com.example.services.PatientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientServiceImpl implements PatientService {
    private final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);
    @Autowired
    AutoPatientMapper autoPatientMapper;
    @Autowired
    PatientRepository patientRepository;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        try {
            Patient patient = autoPatientMapper.toEntity(patientDTO);
            patient.setRole(ERole.PATIENT);
            return autoPatientMapper.toDto(patientRepository.save(patient));
        } catch (Exception e) {
            // Handle the exception
            logger.error("ERROR: saving patient, "+e);
            return null;
        }
    }
}
