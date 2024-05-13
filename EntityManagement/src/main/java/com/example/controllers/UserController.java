package com.example.controllers;

import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.dto.UserDTO;
import com.example.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    @GetMapping("/get-all-doctors")
    public List<DoctorDTO> getAllDoctors(){
        return userService.getAllDoctors();
    }

    @GetMapping("/get-user/{id}")
    public UserDTO getUser(@PathVariable(value = "id") UUID id){
        return userService.findUserByID(id);
    }

    @GetMapping("/get-all-patients")
    public List<PatientDTO> getAllPatients(){
        return userService.getAllPatients();
    }

    @GetMapping("/get-doctor/{id}")
    public DoctorDTO findDoctorById(@PathVariable(value = "id") UUID id){
        return userService.findDoctorById(id);
    }

    @GetMapping("/get-patient/{id}")
    public PatientDTO findPatientById(@PathVariable(value = "id") UUID id){
        return userService.findPatientById(id);
    }

    @PutMapping("/update-doctor/{id}")
    public DoctorDTO updateDoctor(@PathVariable(value = "id") UUID id, @RequestBody DoctorDTO doctorDTO){
        DoctorDTO doctor = userService.findDoctorById(id);
        if (doctor != null) {
            return userService.updateDoctor(doctorDTO);
        } else {
            return null;
        }
    }

    @PutMapping("/update-patient/{id}")
    public PatientDTO updatePatient(@PathVariable(value = "id") UUID id, @RequestBody PatientDTO patientDTO){
        PatientDTO patient = userService.findPatientById(id);
        if (patient != null) {
            return userService.updatePatient(patientDTO);
        } else {
            return null;
        }
    }

    @DeleteMapping("/delete-user/{id}")
    public void deleteUser(@PathVariable UUID id){
        userService.deleteUser(id);
    }
}
