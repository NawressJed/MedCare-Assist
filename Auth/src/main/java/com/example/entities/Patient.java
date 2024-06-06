package com.example.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "userId")
public class Patient extends UserEntity {
    private Date dateOfBirth;
    @ManyToMany(mappedBy = "myPatients")
    @JsonBackReference
    private Set<Doctor> myDoctors;
}
