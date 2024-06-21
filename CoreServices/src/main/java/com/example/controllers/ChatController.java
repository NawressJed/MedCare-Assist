package com.example.controllers;

import com.example.dto.ChatMessageDTO;
import com.example.services.ChatService;
import com.example.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@Slf4j
public class ChatController {
    @Autowired
    ChatService chatService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessageDTO sendMessage(ChatMessageDTO chatMessageDTO) {
        try {
            ChatMessageDTO savedMessage = chatService.save(chatMessageDTO);

            // Notify the recipient
            String notificationMessage = "New message from " + chatMessageDTO.getSenderId();
            notificationService.sendNotification("New Message", notificationMessage, chatMessageDTO.getRecipientId(), null);

            messagingTemplate.convertAndSendToUser(chatMessageDTO.getRecipientId().toString(), "/queue/messages", savedMessage);

            return savedMessage;
        } catch (Exception e) {
            log.error("Error sending message via WebSocket", e);
            return null;
        }
    }

//    @PostMapping("/message")
//    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO chatMessage) {
//        try {
//            // Save chat message to the database
//            ChatMessageDTO savedMessage = chatService.save(chatMessage);
//
//            // Send the message to the recipient (optional, in case you want real-time notification)
//            messagingTemplate.convertAndSendToUser(
//                    chatMessage.getRecipientId().toString(),
//                    "/queue/messages",
//                    savedMessage
//            );
//
//            return ResponseEntity.ok(savedMessage);
//        } catch (Exception e) {
//            log.error("Error sending message", e);
//            return ResponseEntity.status(500).build();
//        }
//    }

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(Principal principal) {
        try {
            // Assuming you have a method to get the user ID from the principal
            UUID userId = chatService.getUserIdByEmail(principal.getName());
            List<ChatMessageDTO> chatHistory = chatService.getChatHistory(userId);
            return ResponseEntity.ok(chatHistory);
        } catch (Exception e) {
            log.error("Error retrieving chat history", e);
            return ResponseEntity.status(500).build();
        }
    }

    // Get messages between two users
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesBetween(
            @RequestParam UUID senderId, @RequestParam UUID recipientId) {
        try {
            List<ChatMessageDTO> messages = chatService.findChatMessages(senderId, recipientId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error retrieving messages", e);
            return ResponseEntity.status(500).build();
        }
    }
}
