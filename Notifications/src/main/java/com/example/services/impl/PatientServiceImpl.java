package com.example.services.impl;

import com.example.dto.PatientDTO;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.log4j.Log4j2;
import java.util.UUID;

@Service
@Log4j2
public class PatientServiceImpl implements PatientService {
    @Autowired
    PatientRepository repository;
    @Autowired
    AutoPatientMapper mapper;

    @Override
    public PatientDTO getPatient(UUID id) {
        try {
            return mapper.toDto(repository.findPatientById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving patient with ID ="+id+e);
            return null;
        }
    }
}
