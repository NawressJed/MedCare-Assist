package com.example.services;

import com.example.dto.DoctorDTO;
import com.example.dto.UserDTO;

import java.util.UUID;

public interface DoctorService {
    DoctorDTO updateInfos(DoctorDTO doctorDTO);
    void changePassword(DoctorDTO user, String newPassword);
    boolean oldPasswordIsValid(DoctorDTO user, String oldPassword);
    DoctorDTO getDoctorById(UUID doctorId);

}
