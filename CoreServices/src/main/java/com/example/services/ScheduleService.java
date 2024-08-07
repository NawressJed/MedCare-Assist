package com.example.services;

import com.example.dto.ScheduleDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ScheduleService {
    ScheduleDTO createSchedule(UUID docId, ScheduleDTO scheduleDTO);
    ScheduleDTO findScheduleById(UUID id);
    List<ScheduleDTO> getDoctorSchedule(UUID docId);
    List<ScheduleDTO> getDoctorScheduleByDate(UUID docId, LocalDate date);
    ScheduleDTO updateSchedule(UUID id, ScheduleDTO scheduleDTO);
    void deleteSchedule(UUID scheduleId);
}
