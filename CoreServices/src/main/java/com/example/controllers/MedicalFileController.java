package com.example.controllers;

import com.example.dto.MedicalFileDTO;
import com.example.services.MedicalFileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
public class MedicalFileController {
    @Autowired
    private MedicalFileService medicalFileService;

    @PostMapping
    public ResponseEntity<MedicalFileDTO> createMedicalFile(@RequestBody MedicalFileDTO medicalFileDTO) {
        try {
            MedicalFileDTO createdMedicalFile = medicalFileService.createMedicalFile(medicalFileDTO);
            return ResponseEntity.ok(createdMedicalFile);
        } catch (Exception e) {
            log.error("ERROR creating medical file " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/medical-file/doctor/{doctorId}/patient/{patientId}")
    public ResponseEntity<MedicalFileDTO> createPatientMedicalFile(
            @PathVariable UUID doctorId,
            @PathVariable UUID patientId,
            @RequestBody MedicalFileDTO medicalFileDTO) {
        try {
            MedicalFileDTO createdMedicalFile = medicalFileService.createPatientMedicalFile(doctorId, patientId, medicalFileDTO);
            return ResponseEntity.ok(createdMedicalFile);
        } catch (Exception e) {
            log.error("ERROR creating medical file " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/medical-file/doctor/{doctorId}")
    public ResponseEntity<MedicalFileDTO> createDoctorMedicalFile(
            @PathVariable UUID doctorId,
            @RequestBody MedicalFileDTO medicalFileDTO) {
        try {
            MedicalFileDTO createdMedicalFile = medicalFileService.createDoctorMedicalFile(doctorId, medicalFileDTO);
            return ResponseEntity.ok(createdMedicalFile);
        } catch (Exception e) {
            log.error("ERROR creating doctor's medical file " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-medical-file/{id}")
    public ResponseEntity<MedicalFileDTO> getMedicalFileByID(@PathVariable UUID id) {
        try {
            MedicalFileDTO medicalFile = medicalFileService.getMedicalFileByID(id);
            return ResponseEntity.ok(medicalFile);
        } catch (Exception e) {
            log.error("ERROR retrieving medical file by its ID " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-medical-file/doctor/{doctorId}")
    public ResponseEntity<List<MedicalFileDTO>> getDoctorMedicalFiles(@PathVariable UUID doctorId) {
        try {
            List<MedicalFileDTO> medicalFiles = medicalFileService.getDoctorMedicalFiles(doctorId);
            return ResponseEntity.ok(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving doctor's medical files " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-medical-file/patient/{patientId}")
    public ResponseEntity<List<MedicalFileDTO>> getPatientMedicalFiles(@PathVariable UUID patientId) {
        try {
            List<MedicalFileDTO> medicalFiles = medicalFileService.getPatientMedicalFiles(patientId);
            return ResponseEntity.ok(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving patient's medical files " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/medical-file/get-all")
    public ResponseEntity<List<MedicalFileDTO>> getAllMedicalFiles() {
        try {
            List<MedicalFileDTO> medicalFiles = medicalFileService.getAllMedicalFiles();
            return ResponseEntity.ok(medicalFiles);
        } catch (Exception e) {
            log.error("ERROR retrieving all medical files " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/medical-file/update")
    public ResponseEntity<MedicalFileDTO> updateMedicalFile(@RequestBody MedicalFileDTO medicalFileDTO) {
        try {
            MedicalFileDTO updatedMedicalFile = medicalFileService.updateMedicalFile(medicalFileDTO);
            return ResponseEntity.ok(updatedMedicalFile);
        } catch (Exception e) {
            log.error("ERROR updating medical file " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/medical-file/delete/{id}")
    public ResponseEntity<Void> deleteMedicalFile(@PathVariable UUID id) {
        try {
            medicalFileService.deleteMedicalFile(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("ERROR deleting medical file " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
