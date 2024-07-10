package com.example.services;


import com.example.dto.NotificationDTO;
import com.example.entities.Appointment;
import com.example.entities.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(String title, String message, UUID userId, Appointment appointment);
    void deleteNotification(UUID id);
    NotificationDTO getNotificationById(UUID id);
    List<NotificationDTO> getNotifications(UUID userId);
    void markAsRead(UUID notificationId);
}
