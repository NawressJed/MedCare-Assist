package com.example.controllers;

import com.example.dto.NotificationDTO;
import com.example.services.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Log4j2
public class NotificationController {
    @Autowired
    NotificationService service;

    @GetMapping("/get-notifications/{id}")
    public List<NotificationDTO> getNotifications(@PathVariable(value = "id") UUID id) {
        try {
            return service.getNotifications(id);
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteNotification(@PathVariable(value = "id") UUID id) {
        try {
            service.deleteNotification(id);
        }catch (Exception e) {
            log.error("ERROR deleting Notification!! "+e);
        }
    }

}
