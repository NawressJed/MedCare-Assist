package com.example.repositories;

import com.example.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    UserEntity findUserEntityByEmail(String email);
    UserEntity findUserEntityById(UUID id);
    UserEntity findByEmail(String username);

}
