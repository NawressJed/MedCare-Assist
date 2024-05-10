package com.example.controllers;

import com.example.dto.AppointmentDTO;
import com.example.services.AppointmentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Log4j2
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/request-appointment")
    public ResponseEntity<String> requestAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            appointmentService.requestAppointment(appointmentDTO);

            return ResponseEntity.ok("Appointment request sent successfully.");
        } catch (Exception e) {
            log.error("ERROR sending request! "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send appointment request.");
        }
    }

    @PutMapping("/approve-appointment/{id}")
    public ResponseEntity<String> approveAppointment(@PathVariable(value = "id") UUID id) {
        try {
            appointmentService.approveAppointment(id);
            return ResponseEntity.ok("Appointment approved successfully.");
        } catch (Exception e) {
            log.error("ERROR approving request! "+ e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve appointment request.");
        }
    }
}
