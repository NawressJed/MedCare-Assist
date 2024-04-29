package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.mapper.AutoDoctorMapper;
import com.example.repositories.DoctorRepository;
import com.example.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    DoctorRepository repository;
    @Autowired
    AutoDoctorMapper mapper;

    @Override
    public List<DoctorDTO> getAllDoctors() {
        List<DoctorDTO> doctors = new ArrayList<>();
        try {
            doctors = mapper.toDto(repository.findAll());
            return doctors;
        }catch (Exception e) {
            return null;
        }
    }
}
