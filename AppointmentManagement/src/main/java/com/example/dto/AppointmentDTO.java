package com.example.dto;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.EAppointmentStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private UUID id;
    private LocalDate date;
    private LocalTime time;
    @Enumerated(EnumType.STRING)
    private EAppointmentStatus appointmentStatus;
    @ManyToOne
    private Doctor doctor;
    @ManyToOne
    private Patient patient;
}
