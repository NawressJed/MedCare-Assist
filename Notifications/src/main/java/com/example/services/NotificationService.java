package com.example.services;


import com.example.dto.response.AppointmentNotificationResponse;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Patient;

import java.util.UUID;

public interface NotificationService {
    void sendAppointmentRequestNotificationToDoctor(Appointment appointment);

    public void sendAppointmentApprovalNotificationToPatient(Appointment appointment);
}
