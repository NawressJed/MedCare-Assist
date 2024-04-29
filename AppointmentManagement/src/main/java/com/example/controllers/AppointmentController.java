package com.example.controllers;

import com.example.dto.AppointmentDTO;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.repositories.AppointmentRepository;
import com.example.services.AppointmentService;
import com.example.services.DoctorService;
import com.example.services.PatientService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @PostMapping("/doctor/add-appointment/{id}")
    public AppointmentDTO createDoctorAppointment(@PathVariable(value = "id") UUID id, @RequestBody AppointmentDTO appointmentDTO) {
        try {
            return appointmentService.createDoctorAppointment(id, appointmentDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-all-appointments")
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

    @GetMapping("/doctor/get-appointment/{id}")
    public List<AppointmentDTO> getAppointmentsByDoctor(@PathVariable(value = "id") UUID id) {
        return appointmentService.findAppointmentByDoctor(id);
    }

    @GetMapping("/patient/get-appointment/{id}")
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
}
