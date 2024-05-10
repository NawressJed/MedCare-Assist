package com.example.services.impl;

import com.example.entities.*;
import com.example.repositories.NotificationRepository;
import com.example.services.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Log4j2
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

//    @Override
//    public void sendAppointmentRequestNotificationToDoctor(Appointment appointment) {
//        Doctor doctor = appointment.getDoctor();
//        Patient patient = appointment.getPatient();
//
//        String message = "Appointment request from " + patient.getFirstname() + " " + patient.getLastname() +
//                " for " + appointment.getDate() + " at " + appointment.getTime() + ".";
//
//        try {
//            Notification notification = new Notification();
//            notification.setNotificationStatus(ENotificationStatus.SENT);
//            notification.setSender(patient);
//            notification.setRecipient(doctor);
//            notification.setTitle("Appointment Request");
//            notification.setMessage(message);
//            notification.setSentAt(LocalDateTime.now());
//            notificationRepository.save(notification);
//        } catch (Exception e) {
//            log.error("ERROR saving notification "+e);
//            throw new RuntimeException(e);
//        }
//
//        String doctorIdentifier = doctor.getFirstname() + "-" + doctor.getLastname();
//
//        messagingTemplate.convertAndSendToUser(doctorIdentifier, "/topic/appointment-requests", message);
//    }

//    public void sendAppointmentApprovalNotificationToPatient(Appointment appointment) {
//        Doctor doctor = appointment.getDoctor();
//        Patient patient = appointment.getPatient();
//
//        String message = "Your appointment request with Dr. " + doctor.getFirstname() + " " + doctor.getLastname() +
//                " for " + appointment.getDate() + " at " + appointment.getTime() + " has been approved.";
//
//        try {
//            Notification notification = new Notification();
//            notification.setNotificationStatus(ENotificationStatus.SENT);
//            notification.setSender(doctor);
//            notification.setRecipient(patient);
//            notification.setTitle("Appointment Approval");
//            notification.setMessage(message);
//            notification.setSentAt(LocalDateTime.now());
//            notificationRepository.save(notification);
//        } catch (Exception e) {
//            log.error("ERROR saving notification "+e);
//            throw new RuntimeException(e);
//        }
//
//        String patientIdentifier = patient.getFirstname() + "-" + patient.getLastname();
//
//        messagingTemplate.convertAndSendToUser(patientIdentifier, "/topic/appointment-approval", message);
//    }
//
//    @Override
//    public void sendAppointmentReminder(Appointment appointment) {
//        LocalDateTime reminderTime = appointment.getDate().atTime(appointment.getTime()).minusHours(24); // Reminder 24 hours before
//        if (LocalDateTime.now().isAfter(reminderTime)) {
//            String message = "Reminder: Appointment with " + appointment.getPatient().getFirstname() + " " +
//                    appointment.getPatient().getLastname() + " on " + appointment.getDate() + " at " + appointment.getTime();
//            sendNotification(message, appointment.getDoctor().getId()); // Send reminder to doctor using user ID
//
//            message = "Reminder: Your appointment with Dr. " + appointment.getDoctor().getFirstname() + " " +
//                    appointment.getDoctor().getLastname() + " is on " + appointment.getDate() + " at " + appointment.getTime();
//            sendNotification(message, appointment.getPatient().getId()); // Send reminder to patient using user ID
//        }
//    }

    @Override
    public void sendNotification(String message, UUID userId) {
        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", message);
    }

//    @Override
//    public List<NotificationDTO> getAllNotifications() {
//        try {
//            return notificationMapper.toDto(notificationRepository.findAll());
//        } catch (Exception e) {
//            log.error("ERROR retrieving all notifications! "+e);
//            return null;
//        }
//    }
//
//    @Override
//    public List<NotificationDTO> getAllRecipientNotifications(UUID id) {
//        List<NotificationDTO> notifications = new ArrayList<>();
//        try {
//            notifications = notificationMapper.toDto(notificationRepository.findNotificationByRecipientId(id));
//            return notifications;
//        }catch (Exception e) {
//            log.error("ERROR retrieving recipient's notifications "+e);
//            return null;
//        }
//    }

    @Override
    public void deleteNotification(UUID id) {
        try {
            notificationRepository.deleteById(id);
        } catch (Exception e) {
            log.error("ERROR deleting notification! "+e);
        }
    }

//    @Override
//    public NotificationDTO updateNotification(NotificationDTO notificationDTO) {
//        try {
//            return notificationMapper.toDto(notificationRepository.save(notificationMapper.toEntity(notificationDTO)));
//        } catch (Exception e) {
//            log.error("ERROR updating notification! "+e);
//            return null;
//        }
//    }

}
