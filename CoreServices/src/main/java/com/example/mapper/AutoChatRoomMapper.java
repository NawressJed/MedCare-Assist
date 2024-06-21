package com.example.mapper;

import com.example.dto.ChatRoomDTO;
import com.example.entities.ChatRoom;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = ChatRoom.class)
public interface AutoChatRoomMapper extends EntityMapper<ChatRoomDTO, ChatRoom> {
}
