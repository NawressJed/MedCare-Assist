package com.example.services.impl;

import com.example.dto.ChatRoomDTO;
import com.example.entities.ChatRoom;
import com.example.mapper.AutoChatRoomMapper;
import com.example.repositories.ChatRoomRepository;
import com.example.services.ChatRoomService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Log4j2
public class ChatRoomServiceImpl implements ChatRoomService {
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private AutoChatRoomMapper mapper;

    @Override
    public ChatRoomDTO createChatRoom(UUID senderId, UUID recipientId) {
        try {
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setSenderId(senderId);
            chatRoom.setRecipientId(recipientId);

            return mapper.toDto(chatRoomRepository.save(chatRoom));
        } catch (Exception e) {
            log.error("ERROR creating chatRoom ", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public ChatRoomDTO getChatRoom(UUID senderId, UUID recipientId) {
        try {
            return mapper.toDto(chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId));
        } catch (Exception e) {
            log.error("ERROR retrieving chatRoom ", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public UUID getOrCreateChatRoomId(UUID senderId, UUID recipientId, boolean createNewRoomIfNotExists) {
        try {
            // Find existing chat room
            ChatRoom chatRoom = chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId);
            if (chatRoom != null) {
                return chatRoom.getId();
            }
            chatRoom = chatRoomRepository.findBySenderIdAndRecipientId(recipientId, senderId);
            if (chatRoom != null) {
                return chatRoom.getId();
            }

            // Create new chat room if it doesn't exist
            if (createNewRoomIfNotExists) {
                ChatRoom newChatRoom = new ChatRoom();
                newChatRoom.setSenderId(senderId);
                newChatRoom.setRecipientId(recipientId);
                ChatRoom savedChatRoom = chatRoomRepository.save(newChatRoom);
                return savedChatRoom.getId();
            }

            return null;
        } catch (Exception e) {
            log.error("Error in getOrCreateChatRoomId", e);
            throw new RuntimeException("Error in getOrCreateChatRoomId", e);
        }
    }
}
