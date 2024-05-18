package com.example.services;


import com.example.dto.NotificationDTO;
import com.example.entities.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(String message, UUID userId);
    void deleteNotification(UUID id);
    List<NotificationDTO> getNotifications(UUID userId);
}
