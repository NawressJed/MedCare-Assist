package com.example.services;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.UserDTO;
import com.example.entities.Patient;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface UserService {
    PatientDTO createPatient(PatientDTO patientDTO);
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    DoctorDTO createPatientToDoctor(UUID doctorId, PatientDTO patient);
    DoctorDTO addPatientToDoctor(UUID doctorId, UUID patientId);
    List<PatientDTO> getAllPatients();
    List<DoctorDTO> getAllDoctors();
    Set<Patient> getMyPatients(UUID doctorId);
    UserDTO findUserByID(UUID id);
    PatientDTO findPatientById(UUID id);
    DoctorDTO findDoctorById(UUID id);
    PatientDTO findUserByEmail(String email);
    PatientDTO updatePatient(PatientDTO patientDTO);
    DoctorDTO updateDoctor(DoctorDTO doctorDTO);
    void deleteUser(UUID id);
}
