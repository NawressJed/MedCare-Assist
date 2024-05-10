package com.example.services.impl;

import com.example.dto.AppointmentDTO;
import com.example.dto.DoctorDTO;
import com.example.dto.PatientDTO;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Notification;
import com.example.entities.Patient;
import com.example.enums.EAppointmentStatus;
import com.example.enums.ENotificationStatus;
import com.example.mapper.AutoAppointmentMapper;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.AppointmentRepository;
import com.example.repositories.NotificationRepository;
import com.example.services.AppointmentService;
import com.example.services.DoctorService;
import com.example.services.NotificationService;
import com.example.services.PatientService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


@Service
@Log4j2
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    NotificationService notificationService;
    @Autowired
    NotificationRepository notificationRepository;
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
    public AppointmentDTO requestAppointment(AppointmentDTO appointmentDTO) {
        try {
            Appointment appointment = appointmentMapper.toEntity(appointmentDTO);
            Patient patient = patientMapper.toEntity(patientService.getPatient(appointment.getPatient().getId()));
            Doctor doctor = doctorMapper.toEntity(doctorService.getDoctor(appointment.getDoctor().getId()));
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setAppointmentStatus(EAppointmentStatus.PENDING);

            String message = "Appointment request from " + patient.getFirstname() + " " + patient.getLastname() +
                " for " + appointment.getDate() + " at " + appointment.getTime() + ".";

        try {
            Notification notification = new Notification();
            notification.setNotificationStatus(ENotificationStatus.SENT);
            notification.setSender(patient);
            notification.setRecipient(doctor);
            notification.setTitle("Appointment Request");
            notification.setMessage(message);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("ERROR saving notification "+e);
            throw new RuntimeException(e);
        }

            notificationService.sendNotification(message ,doctor.getId());
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

            String message = "Your appointment request with Dr. " + appointment.getDoctor().getFirstname() + " " + appointment.getDoctor().getLastname() +
                " for " + appointment.getDate() + " at " + appointment.getTime() + " has been approved.";

            try {
            Notification notification = new Notification();
            notification.setNotificationStatus(ENotificationStatus.SENT);
            notification.setSender(appointment.getDoctor());
            notification.setRecipient(appointment.getPatient());
            notification.setTitle("Appointment Approval");
            notification.setMessage(message);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("ERROR saving notification "+e);
            throw new RuntimeException(e);
        }

            notificationService.sendNotification(message ,appointment.getPatient().getId());


            return appointmentMapper.toDto(appointmentRepository.save(appointment));
        } catch (Exception e) {
            log.error("ERROR approving appointment request", e);
            throw new RuntimeException(e);
        }
    }
}
