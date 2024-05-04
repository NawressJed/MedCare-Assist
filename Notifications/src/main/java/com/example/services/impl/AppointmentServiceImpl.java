package com.example.services.impl;

import com.example.dto.AppointmentDTO;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Notification;
import com.example.entities.Patient;
import com.example.enums.EAppointmentStatus;
import com.example.mapper.AutoAppointmentMapper;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.AppointmentRepository;
import com.example.services.AppointmentService;
import com.example.services.DoctorService;
import com.example.services.NotificationService;
import com.example.services.PatientService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
@Log4j2
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    NotificationService notificationService;
    @Autowired
    PatientService patientService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    AutoDoctorMapper doctorMapper;
    @Autowired
    AutoPatientMapper patientMapper;
    @Autowired
    AutoAppointmentMapper appointmentMapper;

    @Override
    public AppointmentDTO createAppointmentRequest(AppointmentDTO appointmentDTO) {
        try {
            Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
            Patient patient = patientMapper.toEntity(patientService.getPatient(appointment.getPatient().getId()));
            Doctor doctor = doctorMapper.toEntity(doctorService.getDoctor(appointment.getDoctor().getId()));
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setAppointmentStatus(EAppointmentStatus.PENDING);

            notificationService.sendAppointmentRequestNotificationToDoctor(appointment);

            return appointmentMapper.toDto(appointmentRepository.save(appointment));
        } catch (Exception e) {
            log.error("ERROR creating appointment request"+e);
            throw new RuntimeException(e);
        }
    }

    public AppointmentDTO approveAppointment(UUID appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

            appointment.setAppointmentStatus(EAppointmentStatus.APPROVED);
            appointment = appointmentRepository.save(appointment);

            // Notify the patient about the approval
            notificationService.sendAppointmentApprovalNotificationToPatient(appointment);

            return appointmentMapper.toDto(appointment);
        } catch (Exception e) {
            log.error("ERROR approving appointment request", e);
            throw new RuntimeException(e);
        }
    }
}
