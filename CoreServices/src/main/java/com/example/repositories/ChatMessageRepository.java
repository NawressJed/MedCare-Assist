package com.example.repositories;

import com.example.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByChatRoomId(UUID chatRoomId);
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.senderId = :userId OR cm.recipientId = :userId ORDER BY cm.timestamp DESC")
    List<ChatMessage> findChatHistory(UUID userId);
    List<ChatMessage> findBySenderIdAndRecipientId(UUID senderId, UUID recipientId);
    void deleteByChatRoomId(UUID id);
}
