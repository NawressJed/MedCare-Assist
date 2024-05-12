package com.example.services.impl;

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

    @Override
    public void sendNotification(String message, UUID userId) {
        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", message);
    }

    @Override
    public void deleteNotification(UUID id) {
        try {
            notificationRepository.deleteById(id);
        } catch (Exception e) {
            log.error("ERROR deleting notification! "+e);
        }
    }

}
