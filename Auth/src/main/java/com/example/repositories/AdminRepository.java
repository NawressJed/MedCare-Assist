package com.example.repositories;

import com.example.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdminRepository extends JpaRepository<Admin, UUID> {
    Admin findAdminByEmail(String email);
}
