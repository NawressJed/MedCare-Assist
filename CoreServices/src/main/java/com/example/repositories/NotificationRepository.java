package com.example.repositories;

import com.example.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    @Query(value = "SELECT n.* FROM notification AS n WHERE n.recipient_id = :id", nativeQuery = true)
    List<Notification> findNotificationByRecipientId(UUID id);
}
