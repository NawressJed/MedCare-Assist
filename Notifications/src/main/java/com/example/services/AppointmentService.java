package com.example.services;

import com.example.dto.AppointmentDTO;

import java.util.UUID;

public interface AppointmentService {
    AppointmentDTO requestAppointment(AppointmentDTO appointment);
    public AppointmentDTO approveAppointment(UUID appointmentId);
}
