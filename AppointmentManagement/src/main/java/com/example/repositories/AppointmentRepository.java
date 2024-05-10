package com.example.repositories;

import com.example.dto.AppointmentDTO;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    Appointment findAppointmentById(UUID id);
    @Query(value = "SELECT a.* FROM appointment AS a WHERE a.doctor_id = :doctorId AND a.appointment_status = 'APPROVED'", nativeQuery = true)
    List<Appointment> findByDoctorId(UUID doctorId);
    List<Appointment> findByPatientId(UUID patientId);
}
