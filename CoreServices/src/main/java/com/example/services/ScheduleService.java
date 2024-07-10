package com.example.services;

import com.example.dto.ScheduleDTO;

import java.util.List;
import java.util.UUID;

public interface ScheduleService {
    ScheduleDTO createSchedule(UUID docId, ScheduleDTO scheduleDTO);
    ScheduleDTO findScheduleById(UUID id);
    List<ScheduleDTO> getDoctorSchedule(UUID docId);
    ScheduleDTO updateSchedule(UUID id, ScheduleDTO scheduleDTO);
    void deleteSchedule(UUID scheduleId);
}
