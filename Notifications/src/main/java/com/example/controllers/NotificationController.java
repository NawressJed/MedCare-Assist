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


//    @GetMapping("/get-all-notifications")
//    public List<NotificationDTO> getAllNotifications() {
//        try {
//            return service.getAllNotifications();
//        }catch (Exception e) {
//            log.error("ERROR retrieving all the notifications!!" + e);
//            return null;
//        }
//    }
//
//    @GetMapping("/get-recipient-notifications/{id}")
//    public List<NotificationDTO> getRecipientNotifications(@PathVariable(value = "id") UUID id) {
//        try {
//            return service.getAllRecipientNotifications(id);
//        }catch (Exception e) {
//            log.error("ERROR retrieving recipient's notifications!! "+e);
//            return null;
//        }
//    }

    @DeleteMapping("/delete/{id}")
    public void deleteNotification(@PathVariable(value = "id") UUID id) {
        try {
            service.deleteNotification(id);
        }catch (Exception e) {
            log.error("ERROR deleting Notification!! "+e);
        }
    }

}
