package com.example.services;

import com.example.dto.ChatMessageDTO;
import com.example.dto.ChatRoomDTO;
import com.example.entities.ChatMessage;
import com.example.entities.ChatRoom;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    ChatMessageDTO save(ChatMessageDTO chatMessageDTO);
    List<ChatMessageDTO> findChatMessages(UUID senderId, UUID recipientId);
    UUID getUserIdByEmail(String email);
    List<ChatMessageDTO> getChatHistory(UUID userId);
    void deleteChat(UUID chatId);
}
