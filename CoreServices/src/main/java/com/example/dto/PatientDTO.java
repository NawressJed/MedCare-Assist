package com.example.dto;

import com.example.entities.Doctor;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientDTO extends UserDTO {
    private Date dateOfBirth;
//    @ManyToMany(mappedBy = "myPatients")
//    private Set<Doctor> myDoctors;
}
