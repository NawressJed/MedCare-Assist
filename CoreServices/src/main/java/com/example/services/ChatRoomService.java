package com.example.services;

import com.example.dto.ChatRoomDTO;

import java.util.UUID;

public interface ChatRoomService {
    UUID getOrCreateChatRoomId(UUID senderId, UUID recipientId, boolean createNewRoomIfNotExists);
    ChatRoomDTO createChatRoom(UUID senderId, UUID recipientId);
    ChatRoomDTO getChatRoom(UUID senderId, UUID recipientId);

}
