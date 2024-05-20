package com.example.services;


import com.example.dto.NotificationDTO;
import com.example.entities.Appointment;
import com.example.entities.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendAppointmentApprovalNotification(String title, String message, UUID appointmentId, UUID userId);
    void sendNotification(String title, String message, UUID userId, Appointment appointment);
//    void sendNotification(String title, String message, UUID userId);
    void deleteNotification(UUID id);
    List<NotificationDTO> getNotifications(UUID userId);
}
