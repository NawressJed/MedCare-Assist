package com.example.dto;

import com.example.entities.UserEntity;
import com.example.enums.ENotificationStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private UUID id;
    @Enumerated(EnumType.STRING)
    private ENotificationStatus notificationStatus;
    @ManyToOne
    private UserEntity sender;
    @ManyToOne
    private UserEntity recipient;

    private String message;

    private LocalDateTime sentAt;
}
