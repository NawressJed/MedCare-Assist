package com.example.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "userId")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Patient extends UserEntity {
    private Date dateOfBirth;
    @ManyToMany(mappedBy = "myPatients")
    private Set<Doctor> myDoctors;
}
