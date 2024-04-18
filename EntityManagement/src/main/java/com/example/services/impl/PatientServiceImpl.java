package com.example.services.impl;

import com.example.dto.PatientDTO;
import com.example.entities.Patient;
import com.example.entities.UserEntity;
import com.example.enums.ERole;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.PatientRepository;
import com.example.repositories.TokenRepository;
import com.example.services.PatientService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PatientServiceImpl implements PatientService {
    private final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);
    @Autowired
    PatientRepository repository;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    AutoPatientMapper autoPatientMapper;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        try {
            Patient patient = autoPatientMapper.toEntity(patientDTO);
            patient.setRole(ERole.PATIENT);
            return autoPatientMapper.toDto(repository.save(patient));
        } catch (Exception e) {
            logger.error("ERROR creating patient, "+e);
            return null;
        }
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        List<PatientDTO> patients = new ArrayList<>();
        try {
            patients = autoPatientMapper.toDto(repository.findAll());
            return patients;
        } catch (Exception e) {
            logger.error("ERROR retrieving all patients, "+e);
            return null;
        }
    }

    @Override
    public PatientDTO findPatientById(UUID id) {
        try {
            return autoPatientMapper.toDto(repository.findPatientById(id));
        }catch (Exception e) {
            logger.error("ERROR finding Patient by his ID"+ e);
            return null;
        }
    }

    @Override
    public PatientDTO findPatientByEmail(String email) {
        try {
            return autoPatientMapper.toDto(repository.findByEmail(email));
        } catch (Exception e) {
            logger.error("ERROR finding Patient by his email"+ e);
            return null;
        }
    }

    @Override
    @Transactional
    public void deletePatient(UUID id) {
        try {
            UserEntity user = repository.findPatientById(id);
            tokenRepository.findByUser(user);
            tokenRepository.deleteByUser(user);
            repository.deleteById(id);
        } catch (Exception e) {
            logger.error("ERROR deleting Patient by his ID "+ e);
        }
    }

    @Override
    public PatientDTO updatePatient(PatientDTO patientDTO) {
        try {
            return autoPatientMapper.toDto(repository.save(autoPatientMapper.toEntity(patientDTO)));
        } catch (Exception e) {
            logger.error("ERROR updating Patient"+ e);
            return null;
        }
    }
}
