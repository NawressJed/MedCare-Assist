package com.example.services.impl;

import com.example.dto.ScheduleDTO;
import com.example.entities.Doctor;
import com.example.entities.Schedule;
import com.example.mapper.AutoScheduleMapper;
import com.example.repositories.DoctorRepository;
import com.example.repositories.ScheduleRepository;
import com.example.services.ScheduleService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ScheduleServiceImpl implements ScheduleService {
    @Autowired
    ScheduleRepository repository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    AutoScheduleMapper mapper;

    @Override
    public ScheduleDTO createSchedule(UUID docId, ScheduleDTO scheduleDTO) {
        try {
            Schedule schedule = mapper.toEntity(scheduleDTO);
            Doctor doctor = doctorRepository.findDoctorById(docId);
            schedule.setDoctor(doctor);
            schedule.setAvailable(false);
            return mapper.toDto(repository.save(schedule));
        } catch (Exception e) {
            log.error("ERROR creating new schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public ScheduleDTO findScheduleById(UUID id) {
        try {
            return mapper.toDto(repository.findScheduleById(id));
        } catch (Exception e) {
            log.error("ERROR retrieving schedule by its ID" + e);
            return null;
        }
    }

    @Override
    public List<ScheduleDTO> getDoctorSchedule(UUID docId) {
        List<Schedule> schedules = new ArrayList<>();
        try {
            schedules = repository.findScheduleByDoctor_Id(docId);
            List<Schedule> filteredSchedules = schedules.stream()
                    .filter(schedule -> schedule.getAppointment() == null)
                    .collect(Collectors.toList());
            return mapper.toDto(filteredSchedules);
        } catch (Exception e) {
            log.error("ERROR retrieving doctor's schedule " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<ScheduleDTO> getDoctorScheduleByDate(UUID docId, LocalDate date) {
        try {
            List<Schedule> schedules = repository.findScheduleByDoctor_IdAndDate(docId, date);
            return mapper.toDto(schedules);
        } catch (Exception e) {
            log.error("ERROR retrieving doctor's schedule by date " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public ScheduleDTO updateSchedule(UUID id, ScheduleDTO scheduleDTO) {
        try {
            Schedule oldSchedule = repository.findScheduleById(id);
            if (oldSchedule != null) {
                Schedule schedule = mapper.toEntity(scheduleDTO);
                schedule.setId(oldSchedule.getId());
                schedule.setDoctor(doctorRepository.findDoctorById(oldSchedule.getDoctor().getId()));
                return mapper.toDto(repository.save(schedule));
            }
            return null;
        } catch (Exception e) {
            log.error("ERROR updating schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteSchedule(UUID scheduleId) {
        try {
            repository.deleteById(scheduleId);
        } catch (Exception e) {
            log.error("ERROR deleting schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
