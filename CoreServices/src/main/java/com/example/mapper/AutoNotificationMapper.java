package com.example.mapper;

import com.example.dto.NotificationDTO;
import com.example.entities.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Notification.class)
public interface AutoNotificationMapper extends EntityMapper<NotificationDTO, Notification>{
}
