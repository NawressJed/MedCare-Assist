package com.example.dto;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private UUID id;
    private Date date;
    @ManyToOne
    private Doctor doctor;
    @ManyToOne
    private Patient patient;
}
