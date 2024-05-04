package com.example.controllers;

import com.example.dto.AppointmentDTO;
import com.example.services.AppointmentService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Log4j2
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/request")
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        try {
            AppointmentDTO createdAppointment = appointmentService.createAppointmentRequest(appointmentDTO);

            return ResponseEntity.ok(createdAppointment);
        } catch (Exception e) {
            log.error("ERROR sending request! "+ e);
            return null;
        }
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<AppointmentDTO> approveAppointment(@PathVariable(value = "id") UUID id) {
        try {
            AppointmentDTO approvedAppointment = appointmentService.approveAppointment(id);
            return ResponseEntity.ok(approvedAppointment);
        } catch (Exception e) {
            log.error("ERROR approving request! "+ e);
            return null;
        }
    }
}
