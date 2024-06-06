package com.example.controllers;

import com.example.dto.MedicalFileDTO;
import com.example.services.MedicalFileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class MedicalFileController {
    @Autowired
    private MedicalFileService medicalFileService;

    @PostMapping
    public ResponseEntity<MedicalFileDTO> createMedicalFile(@RequestBody MedicalFileDTO medicalFileDTO) {
        MedicalFileDTO createdMedicalFile = medicalFileService.createMedicalFile(medicalFileDTO);
        return ResponseEntity.ok(createdMedicalFile);
    }

    @PostMapping("/medical-file/doctor/{doctorId}/patient/{patientId}")
    public ResponseEntity<MedicalFileDTO> createPatientMedicalFile(
            @PathVariable UUID doctorId,
            @PathVariable UUID patientId,
            @RequestBody MedicalFileDTO medicalFileDTO) {
        MedicalFileDTO createdMedicalFile = medicalFileService.createPatientMedicalFile(doctorId, patientId, medicalFileDTO);
        return ResponseEntity.ok(createdMedicalFile);
    }

    @PostMapping("/medical-file/doctor/{doctorId}")
    public ResponseEntity<MedicalFileDTO> createDoctorMedicalFile(
            @PathVariable UUID doctorId,
            @RequestBody MedicalFileDTO medicalFileDTO) {
        MedicalFileDTO createdMedicalFile = medicalFileService.createDoctorMedicalFile(doctorId, medicalFileDTO);
        return ResponseEntity.ok(createdMedicalFile);
    }

    @GetMapping("/get-medical-file/{id}")
    public ResponseEntity<MedicalFileDTO> getMedicalFileByID(@PathVariable UUID id) {
        MedicalFileDTO medicalFile = medicalFileService.getMedicalFileByID(id);
        return ResponseEntity.ok(medicalFile);
    }

    @GetMapping("/get-medical-file/doctor/{doctorId}")
    public ResponseEntity<List<MedicalFileDTO>> getDoctorMedicalFiles(@PathVariable UUID doctorId) {
        List<MedicalFileDTO> medicalFiles = medicalFileService.getDoctorMedicalFiles(doctorId);
        return ResponseEntity.ok(medicalFiles);
    }

    @GetMapping("/get-medical-file/patient/{patientId}")
    public ResponseEntity<List<MedicalFileDTO>> getPatientMedicalFiles(@PathVariable UUID patientId) {
        List<MedicalFileDTO> medicalFiles = medicalFileService.getPatientMedicalFiles(patientId);
        return ResponseEntity.ok(medicalFiles);
    }

    @GetMapping("/medical-file/get-all")
    public ResponseEntity<List<MedicalFileDTO>> getAllMedicalFiles() {
        List<MedicalFileDTO> medicalFiles = medicalFileService.getAllMedicalFiles();
        return ResponseEntity.ok(medicalFiles);
    }

    @PutMapping("/medical-file/update")
    public ResponseEntity<MedicalFileDTO> updateMedicalFile(@RequestBody MedicalFileDTO medicalFileDTO) {
        MedicalFileDTO updatedMedicalFile = medicalFileService.updateMedicalFile(medicalFileDTO);
        return ResponseEntity.ok(updatedMedicalFile);
    }

    @DeleteMapping("/medical-file/delete/{id}")
    public ResponseEntity<Void> deleteMedicalFile(@PathVariable UUID id) {
        medicalFileService.deleteMedicalFile(id);
        return ResponseEntity.noContent().build();
    }

}
