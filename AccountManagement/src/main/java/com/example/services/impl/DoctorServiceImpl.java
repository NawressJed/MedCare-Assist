package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.mapper.AutoDoctorMapper;
import com.example.repositories.DoctorRepository;
import com.example.services.DoctorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    AutoDoctorMapper autoDoctorMapper;
    @Autowired
    DoctorRepository repository;
    PasswordEncoder passwordEncoder;
    private final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    @Override
    public DoctorDTO updateInfos(DoctorDTO doctorDTO) {
        try {
            return autoDoctorMapper.toDto(repository.save(autoDoctorMapper.toEntity(doctorDTO)));
        } catch (Exception e) {
            logger.error("ERROR updating doctor" + e);
            return null;
        }
    }

    @Override
    public void changePassword(DoctorDTO user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(autoDoctorMapper.toEntity(user));
    }

    @Override
    public boolean oldPasswordIsValid(DoctorDTO user, String oldPassword) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    @Override
    public DoctorDTO getDoctorById(UUID doctorId) {
        DoctorDTO doctorDTO = null;
        try {
            doctorDTO = autoDoctorMapper.toDto(repository.findDoctorById(doctorId));
            return doctorDTO;
        } catch (Exception e) {
            logger.error("ERROR retrieving doctor" + e);
            return null;
        }
    }
}
