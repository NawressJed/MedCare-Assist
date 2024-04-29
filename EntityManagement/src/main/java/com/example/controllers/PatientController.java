package com.example.controllers;

import com.example.dto.PatientDTO;
import com.example.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class PatientController {
    @Autowired
    PatientService patientService;

    @PostMapping("/add-patient")
    public PatientDTO createPatient(@RequestBody PatientDTO patientDTO) {
        return patientService.createPatient(patientDTO);
    }

    @GetMapping("/get-all-patients")
    public List<PatientDTO> getAllPatients(){
        return patientService.getAllPatients();
    }

    @GetMapping("/get-patient/{id}")
    public PatientDTO findPatientById(@PathVariable(value = "id") UUID id){
        return patientService.findPatientById(id);
    }

    @PutMapping("/update-patient/{id}")
    public PatientDTO updatePatient(@PathVariable(value = "id") UUID id, @RequestBody PatientDTO patientDTO){

        PatientDTO patient = patientService.findPatientById(id);
        if (patient != null) {
            return patientService.updatePatient(patientDTO);
        } else {
            return null;
        }
    }

    @DeleteMapping("/delete-patient/{id}")
    public void deletePatient(@PathVariable(value = "id") UUID id){
        patientService.deletePatient(id);
    }

}
