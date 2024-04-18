package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.entities.Doctor;
import com.example.enums.ERole;
import com.example.mapper.AutoDoctorMapper;
import com.example.repositories.DoctorRepository;
import com.example.services.DoctorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    DoctorRepository repository;
    @Autowired
    AutoDoctorMapper autoDoctorMapper;
    private final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    @Override
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        try {
            Doctor doctor = autoDoctorMapper.toEntity(doctorDTO);
            doctor.setRole(ERole.DOCTOR);
            return autoDoctorMapper.toDto(repository.save(doctor));
        } catch (Exception e) {
            logger.error("ERROR creating doctor" + e);
            return null;
        }
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        List<DoctorDTO> doctors = new ArrayList<>();
        try {
            doctors = autoDoctorMapper.toDto(repository.findAll());
            return doctors;
        } catch (Exception e) {
            logger.error("ERROR retrieving doctors" + e);
            return null;
        }
    }

    @Override
    public DoctorDTO findDoctorById(UUID id) {
        try {
            return autoDoctorMapper.toDto(repository.findDoctorById(id));
        } catch (Exception e) {
            logger.error("ERROR retrieving doctor by his ID" + e);
            return null;
        }
    }

    @Override
    public DoctorDTO findDoctorByEmail(String email) {
        try {
            return autoDoctorMapper.toDto(repository.findByEmail(email));
        } catch (Exception e) {
            logger.error("ERROR retrieving doctor by his Email" + e);
            return null;        }
    }

    @Override
    public void deleteDoctor(UUID id) {
        try {
            repository.deleteById(id);
        }catch (Exception e) {
            logger.error("ERROR deleting doctor" + e);

        }
    }

    @Override
    public DoctorDTO updateDoctor(DoctorDTO doctorDTO) {
        try {
            return autoDoctorMapper.toDto(repository.save(autoDoctorMapper.toEntity(doctorDTO)));
        } catch (Exception e) {
            logger.error("ERROR updating doctor" + e);
            return null;
        }
    }
}
