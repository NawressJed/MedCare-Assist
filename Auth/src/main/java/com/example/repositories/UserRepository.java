package com.example.repositories;

import com.example.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    UserEntity findByEmail(String email);
    UserEntity findByEmailIgnoreCase(String emailId);
    boolean existsByEmail(String email);
    UserEntity findUserEntityById(UUID id);
}
