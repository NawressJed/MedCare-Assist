package com.example.services;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.UserDTO;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.EGender;
import com.example.enums.ESpecialty;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface UserService {
    PatientDTO createPatient(PatientDTO patientDTO);
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    ResponseEntity<Map<String, String>> createPatientToDoctor(UUID doctorId, PatientDTO patient);
    DoctorDTO addPatientToDoctor(UUID doctorId, UUID patientId);
    List<PatientDTO> getAllPatients();
    List<DoctorDTO> getAllDoctors();
    Set<Patient> getMyPatients(UUID doctorId);
    UserDTO findUserByID(UUID id);
    PatientDTO findPatientById(UUID id);
    DoctorDTO findDoctorById(UUID id);
    PatientDTO findPatientByEmail(String email);
    List<PatientDTO> findPatientsByEmailContaining(String email);
    PatientDTO findUserByEmail(String email);
    PatientDTO updatePatient(UUID id, Patient patientDTO);
    DoctorDTO updateDoctor(UUID id, Doctor doctor);
    int getTotalPatients(UUID doctorId);
    int getMalePatientsCount(UUID doctorId);
    int getFemalePatientsCount(UUID doctorId);
    void deleteUser(UUID id);
    List<DoctorDTO> getDoctorBySpecialty(ESpecialty specialty);
}
