package com.example.services;


import com.example.entities.Appointment;

public interface NotificationService {
    void sendAppointmentRequestNotificationToDoctor(Appointment appointment);

    public void sendAppointmentApprovalNotificationToPatient(Appointment appointment);
}
