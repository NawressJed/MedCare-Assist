package com.example.services;

import com.example.dto.AppointmentDTO;
import com.example.entities.Appointment;
import com.example.enums.EAppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AppointmentService {
    AppointmentDTO createAppointmentRequest(AppointmentDTO appointment);
    public AppointmentDTO approveAppointment(UUID appointmentId);
}
