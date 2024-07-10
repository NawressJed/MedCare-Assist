package com.example.controllers;

import com.example.dto.ScheduleDTO;
import com.example.entities.Schedule;
import com.example.mapper.AutoScheduleMapper;
import com.example.repositories.ScheduleRepository;
import com.example.services.ScheduleService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Log4j2
public class ScheduleController {
    @Autowired
    ScheduleService service;
    @Autowired
    ScheduleRepository repository;
    @Autowired
    AutoScheduleMapper mapper;

    @PostMapping("/create-schedule/{doctorId}")
    public ResponseEntity<ScheduleDTO> createSchedule(@PathVariable UUID doctorId, @RequestBody ScheduleDTO scheduleDTO) {
        try {
            return ResponseEntity.ok(service.createSchedule(doctorId, scheduleDTO));
        } catch (Exception e) {
            log.error("ERROR creating new schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-doctor-schedule/{id}")
    public ResponseEntity<List<ScheduleDTO>> getDoctorSchedule(@PathVariable(value = "id") UUID doctorId) {
        try {
            List<ScheduleDTO> schedules = service.getDoctorSchedule(doctorId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            log.error("ERROR fetching doctor's schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-schedule/{id}")
    public ResponseEntity<ScheduleDTO> getScheduleById(@PathVariable(value = "id") UUID id) {
        try {
            ScheduleDTO schedule = service.findScheduleById(id);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            log.error("ERROR getting schedule by its ID! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update-schedule/{id}")
    public ResponseEntity<ScheduleDTO> updateSchedule(@PathVariable(value = "id") UUID id, @RequestBody ScheduleDTO scheduleDTO) {
        try {
                return ResponseEntity.ok(service.updateSchedule(id, scheduleDTO));
        } catch (Exception e) {
            log.error("ERROR updating schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete-schedule/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        try {
            service.deleteSchedule(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("ERROR deleting schedule! " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
