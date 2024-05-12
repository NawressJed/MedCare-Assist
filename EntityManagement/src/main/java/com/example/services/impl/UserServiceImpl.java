package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.ERole;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.DoctorRepository;
import com.example.repositories.PatientRepository;
import com.example.repositories.UserRepository;
import com.example.services.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class UserServiceImpl implements UserService {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    AutoPatientMapper autoPatientMapper;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AutoDoctorMapper autoDoctorMapper;
    @Autowired
    AutoUserMapper autoUserMapper;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        try {
            Patient patient = autoPatientMapper.toEntity(patientDTO);
            patient.setRole(ERole.PATIENT);
            return autoPatientMapper.toDto(patientRepository.save(patient));
        } catch (Exception e) {
            log.error("ERROR creating new patient " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        try {
            Doctor doctor = autoDoctorMapper.toEntity(doctorDTO);
            doctor.setRole(ERole.DOCTOR);
            return autoDoctorMapper.toDto(doctorRepository.save(doctor));
        } catch (Exception e) {
            log.error("ERROR creating new doctor " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        List<Patient> patients = new ArrayList<>();
        try {
            patients = patientRepository.findAll();
            return autoPatientMapper.toDto(patients);
        } catch (Exception e) {
            log.error("ERROR retrieving all patients " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        List<Doctor> doctors = new ArrayList<>();
        try {
            doctors = doctorRepository.findAll();
            return autoDoctorMapper.toDto(doctors);
        } catch (Exception e) {
            log.error("ERROR retrieving all doctors " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public PatientDTO findPatientById(UUID id) {
        try {
            return autoPatientMapper.toDto(patientRepository.findPatientById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving patient by his ID= " + id + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public DoctorDTO findDoctorById(UUID id) {
        try {
            return autoDoctorMapper.toDto(doctorRepository.findDoctorById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving doctor by his ID= " + id + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public PatientDTO findUserByEmail(String email) {
        return null;
    }

    @Override
    public PatientDTO updatePatient(PatientDTO patientDTO) {
        try {
            return autoPatientMapper.toDto(patientRepository.save(autoPatientMapper.toEntity(patientDTO)));
        } catch (Exception e) {
            log.error("ERROR updating patient with ID= " + patientDTO.getId() + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public DoctorDTO updateDoctor(DoctorDTO doctorDTO) {
        try {
            return autoDoctorMapper.toDto(doctorRepository.save(autoDoctorMapper.toEntity(doctorDTO)));
        } catch (Exception e) {
            log.error("ERROR updating doctor with ID= " + doctorDTO.getId() + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteUser(UUID id) {
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            log.error("ERROR deleting user by his ID= " + id + e);
            throw new RuntimeException(e);
        }
    }
}
