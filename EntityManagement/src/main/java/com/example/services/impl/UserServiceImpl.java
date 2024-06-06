package com.example.services.impl;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.UserDTO;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.entities.UserEntity;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

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
            patient.setRole(ERole.ROLE_PATIENT);
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
            doctor.setRole(ERole.ROLE_DOCTOR);
            return autoDoctorMapper.toDto(doctorRepository.save(doctor));
        } catch (Exception e) {
            log.error("ERROR creating new doctor " + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> createPatientToDoctor(UUID doctorId, PatientDTO patientDTO) {
        try {
            Doctor doctor = doctorRepository.findDoctorById(doctorId);
            if (doctor != null) {
                Patient newPatient = autoPatientMapper.toEntity(patientDTO);
                newPatient.setRole(ERole.ROLE_PATIENT);
                newPatient = patientRepository.save(newPatient);

                doctor.getMyPatients().add(newPatient);
                doctorRepository.save(doctor);

                // Return a JSON response
                Map<String, String> response = new HashMap<>();
                response.put("message", "Patient added to doctor successfully");
                return ResponseEntity.ok(response);
            } else {
                log.warn("No such doctor with ID " + doctorId);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Doctor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            log.error("ERROR creating new patient for doctor with ID= " + doctorId, e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Internal Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public DoctorDTO addPatientToDoctor(UUID doctorId, UUID patientId) {
        try {
            Doctor doctor = doctorRepository.findDoctorById(doctorId);
            if (doctor == null) {
                log.error("No doctor found with ID " + doctorId);
                throw new RuntimeException("Doctor not found");
            }
            Patient patient = patientRepository.findPatientById(patientId);
            if (patient == null) {
                log.error("No patient found with ID " + patientId);
                throw new RuntimeException("Patient not found");
            }
            doctor.getMyPatients().add(patient);
            patient.getMyDoctors().add(doctor);
            patientRepository.save(patient);
            return autoDoctorMapper.toDto(doctorRepository.save(doctor));
        } catch (Exception e) {
            log.error("ERROR adding the patient to doctor!" + e);
            throw new RuntimeException(e.getMessage());
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
    public Set<Patient> getMyPatients(UUID doctorId) {
        Set<Patient> patients = new HashSet<>();
        try {
            Doctor doctor = doctorRepository.findDoctorById(doctorId);
            return doctorRepository.findPatientsByDoctorId(doctor.getId());
        } catch (Exception e) {
            log.error("ERROR retrieving doctor's patients!" + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserDTO findUserByID(UUID id) {
        try {
            return autoUserMapper.toDto(userRepository.findUserEntityById(id));
        } catch (Exception e) {
            log.error(("ERROR retrieving user by his ID: "+ id + e));
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
    public PatientDTO findPatientByEmail(String email) {
        try {
            return autoPatientMapper.toDto(patientRepository.findPatientByEmail(email));
        } catch (Exception e) {
            log.error("ERROR retrieving patient with his email " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<PatientDTO> findPatientsByEmailContaining(String email) {
        try {
            List<Patient> patients = patientRepository.findByEmailContainingIgnoreCase(email);
            return autoPatientMapper.toDto(patients);
        } catch (Exception e) {
            log.error("ERROR retrieving patients by email containing " + email + ": " + e.getMessage());
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
        Doctor existingDoctor = doctorRepository.findDoctorById(doctorDTO.getId());

        existingDoctor.setWorkPhoneNumber(doctorDTO.getWorkPhoneNumber());
        existingDoctor.setConsultationPrice(doctorDTO.getConsultationPrice());
        existingDoctor.setSpecialty(doctorDTO.getSpecialty());
        if (doctorDTO.getMyPatients() != null && !doctorDTO.getMyPatients().isEmpty()) {
            existingDoctor.setMyPatients(doctorDTO.getMyPatients());
        }

        // Save the updated doctor entity
        Doctor updatedDoctor = doctorRepository.save(existingDoctor);

        return autoDoctorMapper.toDto(updatedDoctor);
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
