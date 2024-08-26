package com.example.controllers;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.UserDTO;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.ESpecialty;
import com.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.print.Doc;
import java.util.*;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/add-doctor")
    public DoctorDTO createDoctor(@RequestBody DoctorDTO doctorDTO) {
        return userService.createDoctor(doctorDTO);
    }

    @PostMapping("/add-patient")
    public PatientDTO createPatient(@RequestBody PatientDTO patientDTO) {
        return userService.createPatient(patientDTO);
    }

    @PutMapping("/add-patient-to-doctor/{id}")
    public ResponseEntity<?> createPatientToDoctor(@PathVariable(value = "id") UUID doctorId, @RequestBody PatientDTO patientDTO) {
        try {
            return userService.createPatientToDoctor(doctorId, patientDTO);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Internal Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/patient-to-doctor/{doctorId}/{patientId}")
    public ResponseEntity<DoctorDTO> addPatientToDoctor(@PathVariable(value = "doctorId") UUID doctorId, @PathVariable(value = "patientId") UUID patientId) {
        try {
            DoctorDTO doctorDTO = userService.addPatientToDoctor(doctorId, patientId);
            if (doctorDTO != null) {
                return ResponseEntity.ok(doctorDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/get-all-doctors")
    public List<DoctorDTO> getAllDoctors(){
        return userService.getAllDoctors();
    }

    @GetMapping("/get-all-patients")
    public List<PatientDTO> getAllPatients(){
        return userService.getAllPatients();
    }

    @GetMapping("/get-doctor-patients/{id}")
    public Set<Patient> getDoctorPatients(@PathVariable(value = "id") UUID doctorId){
        return userService.getMyPatients(doctorId);
    }

    @GetMapping("/get-user/{id}")
    public UserDTO getUser(@PathVariable(value = "id") UUID id){
        return userService.findUserByID(id);
    }

    @GetMapping("/get-doctor/{id}")
    public DoctorDTO findDoctorById(@PathVariable(value = "id") UUID id){
        return userService.findDoctorById(id);
    }

    @GetMapping("/get-patient/{id}")
    public PatientDTO findPatientById(@PathVariable(value = "id") UUID id){
        return userService.findPatientById(id);
    }

    @GetMapping("/get-patient-by-email")
    public ResponseEntity<PatientDTO> getPatientByEmail(@RequestParam String email) {
        try {
            PatientDTO patientDTO = userService.findPatientByEmail(email);
            return ResponseEntity.ok(patientDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search-patients-by-email")
    public ResponseEntity<List<PatientDTO>> searchPatientsByEmail(@RequestParam String email) {
        try {
            List<PatientDTO> patients = userService.findPatientsByEmailContaining(email);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update-doctor/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable(value = "id")  UUID id, @RequestBody Doctor doctor) {
        DoctorDTO updatedDoctor = userService.updateDoctor(id, doctor);
        return ResponseEntity.ok(updatedDoctor);
    }


    @PutMapping("/update-patient/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable(value = "id")  UUID id, @RequestBody Patient patient) {
        PatientDTO updatedPatient = userService.updatePatient(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @GetMapping("/get-patient/total/{id}")
    public int getTotalPatients(@PathVariable(value = "id") UUID doctorId){
        return userService.getTotalPatients(doctorId);
    }

    @GetMapping("/get-male/total/{id}")
    public int getMalePatientsCount(@PathVariable(value = "id") UUID doctorId){
        return userService.getMalePatientsCount(doctorId);
    }

    @GetMapping("/get-female/total/{id}")
    public int getFemalePatientsCount(@PathVariable(value = "id") UUID doctorId){
        return userService.getFemalePatientsCount(doctorId);
    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getDoctorBySpecialty(@RequestParam ESpecialty specialty){
        return userService.getDoctorBySpecialty(specialty);
    }

    @DeleteMapping("/delete-user/{id}")
    public void deleteUser(@PathVariable UUID id){
        userService.deleteUser(id);
    }
}
