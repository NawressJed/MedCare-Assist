package com.example.services.impl;

import com.example.dto.AppointmentDTO;
import com.example.entities.*;
import com.example.enums.EAppointmentStatus;
import com.example.enums.EApprovalStatus;
import com.example.enums.ENotificationStatus;
import com.example.mapper.AutoAppointmentMapper;
import com.example.mapper.AutoDoctorMapper;
import com.example.mapper.AutoPatientMapper;
import com.example.repositories.*;
import com.example.services.AppointmentService;
import com.example.services.DoctorService;
import com.example.services.NotificationService;
import com.example.services.PatientService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    AutoAppointmentMapper mapper;
    @Autowired
    AutoPatientMapper patientMapper;
    @Autowired
    AutoDoctorMapper doctorMapper;
    @Autowired
    PatientService patientService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    ScheduleRepository scheduleRepository;
    private final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    @Override
    public AppointmentDTO createAppointment(AppointmentDTO appointment) {
        try {
            Appointment appointment1 = mapper.toEntity(appointment);
            if (!userRepository.existsById(appointment1.getDoctor().getId())) {
                logger.error("Doctor is not found for the appointment");
                return  null;
            }else if (!userRepository.existsById(appointment1.getPatient().getId())){
                logger.error("Patient is not found for the appointment");
                return null;
            }else {
                appointment1.setDoctor(doctorRepository.findDoctorById(appointment1.getDoctor().getId()));
                appointment1.setPatient(patientRepository.findPatientById(appointment1.getPatient().getId()));
                appointment1.setApprovalStatus(EApprovalStatus.PENDING);
                return mapper.toDto(appointmentRepository.save(appointment1));
            }
        } catch (Exception e) {
            logger.error("ERROR creating appointment" + e);
            return null;
        }
    }

    @Override
    public AppointmentDTO createDoctorAppointment(UUID id, AppointmentDTO appointmentDTO) {
        try {
            Doctor doc = doctorRepository.findDoctorById(id);
            Patient patient = patientRepository.findPatientById(appointmentDTO.getPatient().getId());

            Appointment appointment = mapper.toEntity(appointmentDTO);

            appointment.setDoctor(doc);
            appointment.setPatient(patient);
            appointment.setApprovalStatus(EApprovalStatus.APPROVED);
            appointment.setAppointmentStatus(EAppointmentStatus.UPCOMING);

            appointment = appointmentRepository.save(appointment);

            Schedule conflictingSchedule = scheduleRepository.findByDoctorIdAndDateAndTime(
                    doc.getId(), appointment.getDate(), appointment.getTime());

            if (conflictingSchedule != null) {
                throw new RuntimeException("Time slot not available");
            }

            Schedule schedule = new Schedule();
            schedule.setDoctor(doc);
            schedule.setDate(appointment.getDate());
            schedule.setStartTime(appointment.getTime());
            schedule.setEndTime(appointment.getTime().plusMinutes(30));
            schedule.setAvailable(false);
            schedule.setAppointment(appointment);

            scheduleRepository.save(schedule);

            return mapper.toDto(appointment);
        } catch (Exception e) {
            logger.error("ERROR creating doctor's appointment: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        List<AppointmentDTO> appointments = new ArrayList<>();
        try {
            appointments = mapper.toDto(appointmentRepository.findAll());
            return appointments;
        } catch (Exception e) {
            logger.error("ERROR retrieving appointments" + e);
            return null;
        }
    }

    @Override
    public AppointmentDTO findAppointmentByID(UUID appointmentID) {
        try {
            return mapper.toDto(appointmentRepository.findAppointmentById(appointmentID));
        } catch (Exception e) {
            logger.error("ERROR retrieving appointment by its ID" + e);
            return null;
        }
    }

    @Override
    public List<AppointmentDTO> findAppointmentByDoctor(UUID uuid) {
        List<AppointmentDTO> appointments = new ArrayList<>();
        try {
            appointments = mapper.toDto(appointmentRepository.findByDoctorId(uuid));
            return appointments;
        } catch (Exception e) {
            logger.error("ERROR retrieving doctor's appointment" + e);
            return null;
        }
    }

    @Override
    public List<AppointmentDTO> findAppointmentByPatient(UUID uuid) {
        List<AppointmentDTO> appointments = new ArrayList<>();
        try {
            appointments = mapper.toDto(appointmentRepository.findByPatientId(uuid));
            return appointments;
        } catch (Exception e) {
            logger.error("ERROR retrieving appointment by patient's name" + e);
            return null;
        }
    }

    @Override
    public AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO) {
        try {
            Appointment appointment = mapper.toEntity(appointmentDTO);
            appointment.setDoctor(doctorRepository.findDoctorById(appointment.getDoctor().getId()));
            appointment.setPatient(patientRepository.findPatientById(appointment.getPatient().getId()));
            appointment.setApprovalStatus(EApprovalStatus.APPROVED);

            appointment = appointmentRepository.save(appointment);

            Schedule schedule = scheduleRepository.findScheduleByAppointment_Id(appointment.getId());

            scheduleRepository.delete(schedule);

            Schedule newSchedule = new Schedule();

            newSchedule.setDoctor(appointment.getDoctor());
            newSchedule.setDate(appointment.getDate());
            newSchedule.setStartTime(appointment.getTime());
            newSchedule.setEndTime(appointment.getTime().plusMinutes(30));
            newSchedule.setAvailable(false);
            newSchedule.setAppointment(appointment);

            scheduleRepository.save(newSchedule);

            return mapper.toDto(appointment);
        } catch (Exception e){
            logger.error("Error updating appointment", e);
            return null;
        }
    }

    @Override
    public AppointmentDTO updateAppointmentStatus(UUID appointmentId, String newStatus) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new NotFoundException("Appointment not found"));
            appointment.setAppointmentStatus(EAppointmentStatus.valueOf(newStatus));

            if (Objects.equals(newStatus, EAppointmentStatus.CANCELLED.toString())) {
                Schedule schedule = scheduleRepository.findScheduleByAppointment_Id(appointmentId);
                scheduleRepository.delete(schedule);
            }
            return mapper.toDto(appointmentRepository.save(appointment));
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getAppointmentCount(UUID doctorId) {
        try {
           return appointmentRepository.countApprovedAppointmentsByDoctorId(doctorId);
        }catch (Exception e) {
            logger.error("Failed counting doctor's appointments");
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteAppointment(UUID appointmentID) {
        try {
            Schedule schedule = scheduleRepository.findScheduleByAppointment_Id(appointmentID);
            appointmentRepository.deleteById(appointmentID);
            scheduleRepository.delete(schedule);
        }catch (Exception e) {
            logger.error("ERROR deleting appointment" + e);
        }
    }

    @Override
    public AppointmentDTO requestAppointment(UUID patientId, AppointmentDTO appointmentDTO) {
        try {
            if (appointmentDTO.getDate() == null || appointmentDTO.getTime() == null || appointmentDTO.getDoctor() == null) {
                log.error("Invalid appointment request: Missing required fields.");
                throw new IllegalArgumentException("Missing required fields.");
            }

            Appointment appointment = mapper.toEntity(appointmentDTO);
            Patient patient = patientRepository.findPatientById(patientId);
            Doctor doctor = doctorMapper.toEntity(doctorService.getDoctor(appointment.getDoctor().getId()));

            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setApprovalStatus(EApprovalStatus.PENDING);
            appointment.setAppointmentStatus(null);

            appointment = appointmentRepository.save(appointment);

            Schedule schedule = scheduleRepository.findByDoctorIdAndDateAndStartTime(doctor.getId(), appointment.getDate(), appointment.getTime())
                    .orElse(null);

            if (schedule != null && !schedule.isAvailable()) {
                throw new RuntimeException("Time slot not available");
            }

            if (schedule == null) {
                schedule = new Schedule();
                schedule.setDoctor(doctor);
                schedule.setAppointment(appointment);
                schedule.setDate(appointment.getDate());
                schedule.setStartTime(appointment.getTime());
                schedule.setEndTime(appointment.getTime().plusMinutes(30));
                schedule.setAvailable(false);
            } else {
                schedule.setAvailable(false);
            }

            scheduleRepository.save(schedule);

            String message = "Appointment request from " + patient.getFirstname() + " " + patient.getLastname() +
                    " for " + appointment.getDate() + " at " + appointment.getTime() + ".";

            Notification notification = new Notification();

            try {

                notification.setNotificationStatus(ENotificationStatus.SENT);
                notification.setSender(patient);
                notification.setRecipient(doctor);
                notification.setTitle("Appointment Request");
                notification.setMessage(message);
                notification.setSentAt(LocalDateTime.now());
                notification.setAppointment(appointment);
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("ERROR saving notification " + e);
                throw new RuntimeException(e);
            }

            notificationService.sendNotification("Appointment Request", message, appointment.getDoctor().getId(), appointment);
            return mapper.toDto(appointment);
        } catch (Exception e) {
            log.error("ERROR creating appointment request" + e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public AppointmentDTO approveAppointment(UUID appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

            appointment.setApprovalStatus(EApprovalStatus.APPROVED);
            appointment.setAppointmentStatus(EAppointmentStatus.UPCOMING);

            String message = "Your appointment request with Dr. " + appointment.getDoctor().getFirstname() + " " + appointment.getDoctor().getLastname() +
                    " for " + appointment.getDate() + " at " + appointment.getTime() + " has been approved.";

            Notification notification = new Notification();

            try {
//                Notification notification = notificationRepository.findNotificationByAppointment(appointment.getId());
//                notificationRepository.delete(notification);

                notification.setNotificationStatus(ENotificationStatus.UNREAD);
                notification.setSender(appointment.getDoctor());
                notification.setRecipient(appointment.getPatient());
                notification.setTitle("Appointment Approval");
                notification.setMessage(message);
                notification.setSentAt(LocalDateTime.now());
                notification.setAppointment(appointment);
                notificationRepository.save(notification);

                notificationService.sendNotification("Appointment Approval", message, appointment.getPatient().getId(), appointment);
            } catch (Exception e) {
                log.error("ERROR saving notification "+e);
                throw new RuntimeException(e);
            }

            return mapper.toDto(appointmentRepository.save(appointment));
        } catch (Exception e) {
            log.error("ERROR approving appointment request", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void rejectAppointment(UUID appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

            Schedule schedule = scheduleRepository.findScheduleByAppointment_Id(appointment.getId());

            appointment.setApprovalStatus(EApprovalStatus.REJECTED);

            Notification notification = notificationRepository.findNotificationByAppointment(appointment.getId());
            notificationRepository.delete(notification);

            scheduleRepository.delete(schedule);

            appointmentRepository.save(appointment);
        }catch (Exception e) {
            log.error("ERROR rejecting appointment with ID: " + appointmentId + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
