package com.example.repositories;

import com.example.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    Schedule findScheduleById(UUID id);
    @Query(value = "SELECT s.* FROM schedule AS s WHERE s.doctor_id = :doctorId AND s.available = false", nativeQuery = true)
    List<Schedule> findScheduleByDoctor_Id(UUID doctorId);

    Optional<Schedule> findByDoctorIdAndDateAndStartTime(UUID doctorId, LocalDate date, LocalTime startTime);

    @Query(value = "SELECT * FROM Schedule s WHERE s.doctor_id = :doctorId AND s.date = :date AND :time BETWEEN s.start_time AND s.end_time", nativeQuery = true)
    Schedule findByDoctorIdAndDateAndTime(UUID doctorId, LocalDate date, LocalTime time);

    List<Schedule> findScheduleByDoctor_IdAndDate(UUID docId, LocalDate date);

    Schedule findScheduleByAppointment_Id(UUID appointmentId);
}
