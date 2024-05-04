package com.example.services;

import com.example.dto.DoctorDTO;

import java.util.UUID;

public interface DoctorService {
    DoctorDTO getDoctor(UUID id);
}
