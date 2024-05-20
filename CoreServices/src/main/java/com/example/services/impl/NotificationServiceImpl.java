package com.example.services.impl;

import com.example.dto.NotificationDTO;
import com.example.entities.Appointment;
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
    public void sendAppointmentApprovalNotification(String title, String message, UUID appointmentId, UUID userId) {
        String jsonMessage = String.format("{\"title\": \"%s\", \"message\": \"%s\", \"appointmentId\": \"%s\"}", title, message, appointmentId);
        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", jsonMessage);
    }

    @Override
    public void sendNotification(String title, String message, UUID userId, Appointment appointment) {
        String jsonMessage = String.format("{\"title\": \"%s\", \"message\": \"%s\", \"appointment\": {\"id\": \"%s\"}}", title, message, appointment.getId());
        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", jsonMessage);
    }

//    @Override
//    public void sendNotification(String title, String message, UUID userId) {
//        String jsonMessage = String.format("{\"title\": \"%s\", \"message\": \"%s\"}", title, message);
//        messagingTemplate.convertAndSendToUser(userId.toString(), "/notify", jsonMessage);
//    }

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

}

