package com.example.repositories;

import com.example.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    @Query(value = "SELECT u.firstname, u.lastname FROM user AS u WHERE u.uuid = :id", nativeQuery = true)
    UserEntity findUserEntityById(UUID id);

}
