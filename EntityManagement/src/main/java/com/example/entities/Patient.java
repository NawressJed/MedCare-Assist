package com.example.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@EqualsAndHashCode(callSuper = true, exclude = "myDoctors")
@ToString(callSuper = true, exclude = "myDoctors")
public class Patient extends UserEntity {
    private Date dateOfBirth;
    @ManyToMany(mappedBy = "myPatients")
    @JsonBackReference
    private Set<Doctor> myDoctors;
}
