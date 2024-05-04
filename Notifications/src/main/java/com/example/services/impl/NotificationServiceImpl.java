package com.example.services.impl;

import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Notification;
import com.example.entities.Patient;
import com.example.enums.ENotificationStatus;
import com.example.mapper.AutoDoctorMapper;
import com.example.repositories.NotificationRepository;
import com.example.services.DoctorService;
import com.example.services.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Log4j2
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    DoctorService doctorService;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    AutoDoctorMapper mapper;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendAppointmentRequestNotificationToDoctor(Appointment appointment) {
        Doctor doctor = appointment.getDoctor();
        Patient patient = appointment.getPatient();

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

        String doctorIdentifier = doctor.getFirstname() + "-" + doctor.getLastname();

        messagingTemplate.convertAndSendToUser(doctorIdentifier, "/topic/appointment-requests", message);
    }

    public void sendAppointmentApprovalNotificationToPatient(Appointment appointment) {
        Doctor doctor = appointment.getDoctor();
        Patient patient = appointment.getPatient();

        String message = "Your appointment request with Dr. " + doctor.getFirstname() + " " + doctor.getLastname() +
                " for " + appointment.getDate() + " at " + appointment.getTime() + " has been approved.";

        try {
            Notification notification = new Notification();
            notification.setNotificationStatus(ENotificationStatus.SENT);
            notification.setSender(doctor);
            notification.setRecipient(patient);
            notification.setTitle("Appointment Approval");
            notification.setMessage(message);
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("ERROR saving notification "+e);
            throw new RuntimeException(e);
        }

        String patientIdentifier = patient.getFirstname() + "-" + patient.getLastname();

        messagingTemplate.convertAndSendToUser(patientIdentifier, "/topic/appointment-approval", message);
    }
}
