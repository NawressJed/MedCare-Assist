package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.mapper.AutoDoctorMapper;
import com.example.repositories.DoctorRepository;
import com.example.services.DoctorService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Log4j2
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    DoctorRepository repository;
    @Autowired
    AutoDoctorMapper mapper;

    @Override
    public DoctorDTO getDoctor(UUID id) {
        try {
            return mapper.toDto(repository.findDoctorById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving doctor with ID = "+id+e);
            return null;
        }
    }
}
