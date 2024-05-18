package com.example.services.impl;

import com.example.dto.NotificationDTO;
import com.example.entities.Notification;
import com.example.mapper.AutoNotificationMapper;
import com.example.repositories.NotificationRepository;
import com.example.services.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    public void sendNotification(String message, UUID userId) {
        // Create a JSON string for the message
        String jsonMessage = String.format("{\"message\": \"%s\"}", message);
        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", jsonMessage);
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
    public List<NotificationDTO> getNotifications(UUID userId) {
        List<Notification> notifications = new ArrayList<>();
        try {
            notifications = notificationRepository.findNotificationByRecipientId(userId);
            return mapper.toDto(notifications);
        } catch (Exception e) {
            log.error("ERROR retrieving all notifications "+ e.getMessage());
            throw new RuntimeException(e);
        }
    }

}
