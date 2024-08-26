package com.example.repositories;

import com.example.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    Appointment findAppointmentById(UUID id);
    @Query(value = "SELECT a.* FROM appointment AS a WHERE a.doctor_id = :doctorId AND a.approval_status = 'APPROVED'", nativeQuery = true)
    List<Appointment> findByDoctorId(UUID doctorId);

    List<Appointment> findByPatientId(UUID patientId);
    List<Appointment> findByDateAndTime(LocalDate date, LocalTime time);
    List<Appointment> findByDateAndTimeBetween(LocalDate date, LocalTime timeStart, LocalTime timeEnd);

    @Query(value = "SELECT COUNT(a.id) FROM appointment AS a WHERE a.doctor_id = :doctorId AND a.approval_status = 'APPROVED'", nativeQuery = true)
    int countApprovedAppointmentsByDoctorId(UUID doctorId);
}
