package com.example.services.impl;

import com.example.dto.NotificationDTO;
import com.example.entities.Appointment;
import com.example.entities.Notification;
import com.example.enums.ENotificationStatus;
import com.example.mapper.AutoNotificationMapper;
import com.example.repositories.NotificationRepository;
import com.example.services.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    AutoNotificationMapper mapper;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotification(String title, String message, UUID userId, Appointment appointment) {
        try {
            String jsonMessage;
            if (appointment != null) {
                jsonMessage = String.format(
                        "{\"title\": \"%s\", \"message\": \"%s\", \"appointment\": {\"id\": \"%s\", \"date\": \"%s\", \"time\": \"%s\"}, \"notificationStatus\": \"UNREAD\"}",
                        title, message, appointment.getId().toString(), appointment.getDate().toString(), appointment.getTime().toString());
            } else {
                jsonMessage = String.format(
                        "{\"title\": \"%s\", \"message\": \"%s\", \"notificationStatus\": \"UNREAD\"}",
                        title, message);
            }
            log.debug("Sending notification to user {}: {}", userId, jsonMessage);
            messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", jsonMessage);
        } catch (Exception e) {
            log.error("Error sending notification: " + e.getMessage());
        }
    }

    @Override
    public void deleteNotification(UUID id) {
        try {
            notificationRepository.deleteById(id);
        } catch (Exception e) {
            log.error("ERROR deleting notification! "+e);
        }
    }

    @Override
    public NotificationDTO getNotificationById(UUID id) {
        try {
            Notification notification = notificationRepository.findById(id).orElseThrow();
            return mapper.toDto(notification);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<NotificationDTO> getNotifications(UUID userId) {
        List<Notification> notifications = new ArrayList<>();
        try {
            notifications = notificationRepository.findNotificationByRecipientId(userId);

            notifications.stream()
                    .filter(notification -> notification.getNotificationStatus() == ENotificationStatus.UNREAD)
                    .forEach(notification -> {
                        notification.setNotificationStatus(ENotificationStatus.READ);
                        notificationRepository.save(notification);
                    });

            return notifications.stream().map(notification -> {
                NotificationDTO dto = mapper.toDto(notification);
                dto.setAppointment(notification.getAppointment());
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("ERROR retrieving all notifications " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void markAsRead(UUID notificationId) {
        try {
            Notification notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new RuntimeException("Notification not found"));
            notification.setNotificationStatus(ENotificationStatus.READ);
            notificationRepository.save(notification);
        } catch (RuntimeException e) {
            log.error("ERROR marking notification as read! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

}

