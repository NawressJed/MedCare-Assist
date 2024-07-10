package com.example;

import com.example.entities.Appointment;
import com.example.repositories.AppointmentRepository;
import com.example.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class Reminder {
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.MINUTES)
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTimeStart = now.plusMinutes(59).withSecond(0).withNano(0);
        LocalDateTime reminderTimeEnd = now.plusHours(1).withSecond(0).withNano(0);

        log.info("Running sendAppointmentReminders at {}. Checking for appointments between {} and {}.", now, reminderTimeStart, reminderTimeEnd);

        List<Appointment> upcomingAppointments = appointmentRepository.findByDateAndTimeBetween(
                reminderTimeStart.toLocalDate(),
                reminderTimeStart.toLocalTime(),
                reminderTimeEnd.toLocalTime());

        log.info("Found {} appointments for the reminder time.", upcomingAppointments.size());

        for (Appointment appointment : upcomingAppointments) {
            String docFullName = appointment.getDoctor().getFirstname() + " " + appointment.getDoctor().getLastname();
            String patientFullName = appointment.getPatient().getFirstname() + " " + appointment.getPatient().getLastname();

            String patientMessage = String.format("Reminder: You have an appointment with Dr. %s today at %s.",
                    docFullName, appointment.getTime());

            log.info("Sending reminder to patient {}: {}", appointment.getPatient().getId(), patientMessage);
            notificationService.sendNotification("Appointment Reminder", patientMessage, appointment.getPatient().getId(), appointment);

            String doctorMessage = String.format("Reminder: You have an appointment with %s today at %s.",
                    patientFullName, appointment.getTime());

            log.info("Sending reminder to doctor {}: {}", appointment.getDoctor().getId(), doctorMessage);
            notificationService.sendNotification("Appointment Reminder", doctorMessage, appointment.getDoctor().getId(), appointment);
        }
    }
}
