package com.example.services.impl;

import com.example.dto.MedicalFileDTO;
import com.example.entities.Doctor;
import com.example.entities.MedicalFile;
import com.example.mapper.AutoMedicalFileMapper;
import com.example.repositories.DoctorRepository;
import com.example.repositories.MedicalFileRepository;
import com.example.services.MedicalFileService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class MedicalFileServiceImpl implements MedicalFileService {
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    MedicalFileRepository repository;
    @Autowired
    AutoMedicalFileMapper mapper;

    @Override
    public MedicalFileDTO createMedicalFile(MedicalFileDTO medicalFileDTO) {
        try {
            MedicalFile medicalFile = mapper.toEntity(medicalFileDTO);
            return mapper.toDto(repository.save(medicalFile));
        } catch (Exception e) {
            log.error("ERROR creating new medical file! "+ e);
            return null;
        }
    }

    @Override
    public MedicalFileDTO createDoctorMedicalFile(UUID id, MedicalFileDTO medicalFileDTO) {
        try {
            Doctor doctor = doctorRepository.findDoctorById(id);
            MedicalFile medicalFile = mapper.toEntity(medicalFileDTO);
            medicalFile.setDoctor(doctor);
            return mapper.toDto(repository.save(medicalFile));
        } catch (Exception e) {
            log.error("ERROR creating medical file by doctor with ID= " + id + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public MedicalFileDTO getMedicalFileByID(UUID id) {
        try {
            return mapper.toDto(repository.findMedicalFileById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving medical file with ID: "+id + " "+ e);
            return null;
        }
    }

    @Override
    public List<MedicalFileDTO> getDoctorMedicalFiles(UUID id) {
        List<MedicalFile> medicalFiles = new ArrayList<>();
        try {
            medicalFiles = repository.getMedicalFileByDoctor(id);
            return mapper.toDto(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving medical files of doctor with ID: "+ id + " " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MedicalFileDTO> getPatientMedicalFiles(UUID id) {
        List<MedicalFile> medicalFiles = new ArrayList<>();
        try {
            medicalFiles = repository.getMedicalFileByPatient(id);
            return mapper.toDto(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving medical files of patient with ID: "+ id + " " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<MedicalFileDTO> getAllMedicalFiles() {
        List<MedicalFile> medicalFiles = new ArrayList<>();
        try {
            medicalFiles = repository.findAll();
            return mapper.toDto(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving all medical files " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public MedicalFileDTO updateMedicalFile(MedicalFileDTO medicalFileDTO) {
        try {
            return mapper.toDto(repository.save(mapper.toEntity(medicalFileDTO)));
        } catch (Exception e) {
            log.error("ERROR updating medical file " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteMedicalFile(UUID id) {
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            log.error("ERROR deleting medical file " + e);
            throw new RuntimeException(e);
        }
    }
}
