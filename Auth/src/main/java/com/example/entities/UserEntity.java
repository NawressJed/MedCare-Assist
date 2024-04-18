package com.example.entities;

import com.example.enums.EGender;
import com.example.enums.ERole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class UserEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "uuid", columnDefinition = "BINARY(16)")
    private UUID id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private int phone;
    @Enumerated(EnumType.STRING)
    private EGender gender;
    @Enumerated(EnumType.STRING)
    private ERole role;
}
