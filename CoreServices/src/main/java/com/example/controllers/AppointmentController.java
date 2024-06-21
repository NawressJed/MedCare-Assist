package com.example.controllers;

import com.example.dto.AppointmentDTO;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.repositories.AppointmentRepository;
import com.example.services.AppointmentService;
import com.example.services.DoctorService;
import com.example.services.PatientService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@Log4j2
public class AppointmentController {
    @Autowired
    AppointmentService appointmentService;
    @Autowired
    PatientService patientService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    AppointmentRepository repository;

    @PostMapping("/add-appointment")
    public AppointmentDTO createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            return appointmentService.createAppointment(appointmentDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/doctor-add-appointment/{id}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public AppointmentDTO createDoctorAppointment(@PathVariable(value = "id") UUID id, @RequestBody AppointmentDTO appointmentDTO) {
        try {
            return appointmentService.createDoctorAppointment(id, appointmentDTO);
        } catch (Exception e) {
            log.error("ERROR creating doctor's appointment!!");
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-all")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/get-all-patients")
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/get-all-doctors")
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/get-appointment/{id}")
    public AppointmentDTO getAppointmentsByID(@PathVariable(value = "id") UUID id) {
        return appointmentService.findAppointmentByID(id);
    }

    @GetMapping("/doctor-get-appointment/{id}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public List<AppointmentDTO> getAppointmentsByDoctor(@PathVariable(value = "id") UUID id) {
        return appointmentService.findAppointmentByDoctor(id);
    }

    @GetMapping("/patient-get-appointment/{id}")
    public List<AppointmentDTO> getAppointmentsByPatient(@PathVariable(value = "id") UUID id) {
        return appointmentService.findAppointmentByPatient(id);
    }

    @PutMapping("/update-appointment/{id}")
    public AppointmentDTO updateAppointment(@PathVariable(value = "id") UUID id,
                                            @RequestBody AppointmentDTO appointmentDTO) {
        try {
            AppointmentDTO appointment = appointmentService.findAppointmentByID(id);
            if (appointment != null) {
                appointment = appointmentService.updateAppointment(appointmentDTO);
            }
            return appointment;
        } catch (Exception e) {
            log.error("Error updating appointment", e);
            return null;
        }
    }

    @DeleteMapping("/delete-appointment/{id}")
    public void deleteAppointment(@PathVariable UUID id){
        appointmentService.deleteAppointment(id);
    }

    @PostMapping("/request-appointment/{id}")
    public ResponseEntity<AppointmentDTO> requestAppointment(@PathVariable(value = "id") UUID id, @RequestBody AppointmentDTO appointmentDTO) {
        try {
            AppointmentDTO createdAppointment = appointmentService.requestAppointment(id, appointmentDTO);
            return ResponseEntity.ok(createdAppointment);
        } catch (Exception e) {
            log.error("ERROR sending request! ", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/approve-appointment/{id}")
    public ResponseEntity<Map<String, String>> approveAppointment(@PathVariable(value = "id") UUID id) {
        try {
            appointmentService.approveAppointment(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Appointment approved successfully.");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            log.error("Appointment not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Appointment not found"));
        } catch (Exception e) {
            log.error("ERROR approving request! "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to approve appointment"));
        }
    }

    @PutMapping("/reject-appointment/{id}")
    public ResponseEntity<Map<String, String>> rejectAppointment(@PathVariable(value = "id") UUID id) {
        try {
            appointmentService.rejectAppointment(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Appointment rejected successfully.");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            log.error("Appointment not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Appointment not found"));
        } catch (Exception e) {
            log.error("ERROR rejecting request! "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to reject appointment"));
        }
    }

}
