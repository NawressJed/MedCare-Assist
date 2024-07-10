package com.example.repositories;

import com.example.entities.ChatMessage;
import com.example.entities.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    ChatRoom findChatRoomById(UUID chatRoomId);
    ChatRoom findBySenderIdAndRecipientId(UUID senderId, UUID recipientId);
    @Query(value = "SELECT cr FROM chat_room AS cr WHERE cr.sender_id = :patientId OR ce.recipient_id = :patientId", nativeQuery = true)
    List<ChatRoom> findChatRoomsByPatientId(UUID patientId);
}
