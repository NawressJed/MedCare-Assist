package com.example.services.impl;

import com.example.dto.ChatMessageDTO;
import com.example.entities.ChatMessage;
import com.example.mapper.AutoChatMessageMapper;
import com.example.repositories.ChatMessageRepository;
import com.example.repositories.ChatRoomRepository;
import com.example.repositories.UserRepository;
import com.example.services.ChatRoomService;
import com.example.services.ChatService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ChatServiceImpl implements ChatService {
    @Autowired
    ChatMessageRepository chatMessageRepository;
    @Autowired
    ChatRoomRepository chatRoomRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ChatRoomService chatRoomService;
    @Autowired
    AutoChatMessageMapper mapper;

    @Override
    public ChatMessageDTO save(ChatMessageDTO chatMessageDTO) {
        try {
            ChatMessage chatMessage = mapper.toEntity(chatMessageDTO);
            UUID chatRoomId = chatRoomService.getOrCreateChatRoomId(chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId(), true);
            if (chatRoomId == null) {
                throw new RuntimeException("Chat room could not be created or found");
            }

            chatMessage.setChatRoom(chatRoomRepository.findChatRoomById(chatRoomId));

            return mapper.toDto(chatMessageRepository.save(chatMessage));
        } catch (Exception e) {
            log.error("Error in save", e);
            throw new RuntimeException("Error in save", e);
        }
    }

    @Override
    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).getId();
    }

    @Override
    public List<ChatMessageDTO> getChatHistory(UUID userId) {
        List<ChatMessage> allMessages = chatMessageRepository.findChatHistory(userId);
        return mapper.toDto(allMessages.stream()
                .collect(Collectors.groupingBy(cm -> cm.getSenderId().equals(userId) ? cm.getRecipientId() : cm.getSenderId()))
                .values().stream()
                .map(messages -> messages.get(0))
                .collect(Collectors.toList()));
    }

    @Override
    public void deleteChat(UUID chatId) {

    }

    @Override
    public List<ChatMessageDTO> findChatMessages(UUID senderId, UUID recipientId) {
        try {
            UUID chatRoomId = chatRoomService.getOrCreateChatRoomId(senderId, recipientId, false);
            if (chatRoomId == null) {
                return List.of();
            }

            List<ChatMessage> messages = chatMessageRepository.findByChatRoomId(chatRoomId);
            return messages.stream()
                    .map(message -> new ChatMessageDTO(
                            message.getId(),
                            message.getChatRoom().getId(),
                            message.getSenderId(),
                            message.getRecipientId(),
                            message.getContent(),
                            message.getTimestamp().toString()
                    ))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error in findChatMessages", e);
            throw new RuntimeException("Error in findChatMessages", e);
        }
    }
}
