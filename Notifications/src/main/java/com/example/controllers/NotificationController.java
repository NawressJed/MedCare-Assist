package com.example.controllers;

import com.example.services.NotificationService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Log4j2
public class NotificationController {
    @Autowired
    NotificationService service;

    @DeleteMapping("/delete/{id}")
    public void deleteNotification(@PathVariable(value = "id") UUID id) {
        try {
            service.deleteNotification(id);
        }catch (Exception e) {
            log.error("ERROR deleting Notification!! "+e);
        }
    }

}
