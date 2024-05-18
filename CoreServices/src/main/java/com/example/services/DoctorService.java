package com.example.services;

import com.example.dto.DoctorDTO;

import java.util.List;
import java.util.UUID;

public interface DoctorService {
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctor(UUID id);
}
