package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private UUID id;
    private UUID chatRoomId;
    private UUID senderId;
    private UUID recipientId;
    private String content;
    private String timestamp;

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}