package com.example.controllers;

import com.example.dto.ChatMessageDTO;
import com.example.entities.UserEntity;
import com.example.repositories.UserRepository;
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
    SimpMessagingTemplate messagingTemplate;
    @Autowired
    UserRepository userRepository;


    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessageDTO sendMessage(ChatMessageDTO chatMessageDTO) {
        try {
            ChatMessageDTO savedMessage = chatService.save(chatMessageDTO);

            messagingTemplate.convertAndSendToUser(chatMessageDTO.getRecipientId().toString(), "/queue/messages", savedMessage);

            return savedMessage;
        } catch (Exception e) {
            log.error("Error sending message via WebSocket", e);
            return null;
        }
    }

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(Principal principal) {
        try {
            UUID userId = chatService.getUserIdByEmail(principal.getName());
            List<ChatMessageDTO> chatHistory = chatService.getChatHistory(userId);
            return ResponseEntity.ok(chatHistory);
        } catch (Exception e) {
            log.error("Error retrieving chat history", e);
            return ResponseEntity.status(500).build();
        }
    }

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

    @PostMapping("/chatbot/message")
    public ResponseEntity<ChatMessageDTO> sendChatbotMessage(@RequestBody ChatMessageDTO chatMessageDTO) {
        ChatMessageDTO savedMessage = chatService.save(chatMessageDTO);
        return ResponseEntity.ok(savedMessage);
    }

    @DeleteMapping("/delete/{senderId}/{recipientId}")
    public ResponseEntity<Void> deleteChat(@PathVariable UUID senderId, @PathVariable UUID recipientId) {
        chatService.deleteChat(senderId, recipientId);
        return ResponseEntity.noContent().build();
    }
}
