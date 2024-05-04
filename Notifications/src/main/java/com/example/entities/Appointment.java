package com.example.entities;

import com.example.enums.EAppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "uuid", columnDefinition = "BINARY(16)")
    private UUID id;
    private Date date;
    private LocalTime time;
    @Enumerated(EnumType.STRING)
    private EAppointmentStatus appointmentStatus;
    @ManyToOne
    @JoinColumn(nullable = false, name = "doctor_id")
    private Doctor doctor;
    @ManyToOne
    @JoinColumn(nullable = false, name = "patient_id")
    private Patient patient;

}
