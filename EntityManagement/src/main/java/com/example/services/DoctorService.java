package com.example.services;

import com.example.dto.DoctorDTO;
import com.example.dto.UserDTO;

import java.util.List;
import java.util.UUID;

public interface DoctorService {
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    List<DoctorDTO> getAllDoctors();
    DoctorDTO findDoctorById(UUID id);
    UserDTO findDoctorByEmail(String email);
    void deleteDoctor(UUID id);
    DoctorDTO updateDoctor(DoctorDTO doctorDTO);
}
