package com.example.mapper;

import com.example.dto.ChatMessageDTO;
import com.example.entities.ChatMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = ChatMessage.class)
public interface AutoChatMessageMapper extends EntityMapper<ChatMessageDTO, ChatMessage> {
    @Override
    @Mapping(source = "chatRoom.id", target = "chatRoomId")
    ChatMessageDTO toDto(ChatMessage chatMessage);

    @Override
    @Mapping(source = "chatRoomId", target = "chatRoom.id")
    ChatMessage toEntity(ChatMessageDTO chatMessageDTO);
}
