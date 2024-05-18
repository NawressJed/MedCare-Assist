package com.example.services.impl;

import com.example.dto.PatientDTO;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.services.PatientService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class PatientServiceImpl implements PatientService {
    @Autowired
    AutoPatientMapper mapper;
    @Autowired
    PatientRepository repository;

    @Override
    public List<PatientDTO> getAllPatients() {
        List<PatientDTO> patients = new ArrayList<>();
        try {
            patients = mapper.toDto(repository.findAll());
            return patients;
        }catch (Exception e) {
            return null;
        }
    }

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
