package com.example.services.impl;

import com.example.dto.PatientDTO;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
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
}
