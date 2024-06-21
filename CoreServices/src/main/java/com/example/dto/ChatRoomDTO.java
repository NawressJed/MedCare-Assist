package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDTO {
    private UUID id;
    private UUID senderId;
    private UUID recipientId;
    private String createdDate;
}
