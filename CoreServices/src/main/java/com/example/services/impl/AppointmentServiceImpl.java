package com.example.services.impl;

import com.example.dto.AppointmentDTO;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Notification;
import com.example.entities.Patient;
import com.example.enums.EAppointmentStatus;
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
import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
                appointment1.setAppointmentStatus(EAppointmentStatus.PENDING);
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
            if (doc != null) {
                Appointment appointment = mapper.toEntity(appointmentDTO);
                appointment.setDoctor(doc);
                appointment.setPatient(patient);
                appointment.setAppointmentStatus(EAppointmentStatus.APPROVED);
                return mapper.toDto(appointmentRepository.save(appointment));
            }
            logger.error("No such doctor with this ID = "+id);
            return null;
        } catch (Exception e) {
            logger.error("ERROR creating doctor's appointment" + e);
            throw  new RuntimeException(e);
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
    public AppointmentDTO updateAppointment(AppointmentDTO appointment) {
        try {
            return mapper.toDto(appointmentRepository.save(mapper.toEntity(appointment)));
        } catch (Exception e){
            logger.error("Error updating appointment", e);
            return null;
        }
    }

    @Override
    public void deleteAppointment(UUID appointmentID) {
        try {
            appointmentRepository.deleteById(appointmentID);
        }catch (Exception e) {
            logger.error("ERROR deleting appointment" + e);
        }
    }

    @Override
    public AppointmentDTO requestAppointment(UUID patientId, AppointmentDTO appointmentDTO) {
        try {
            Appointment appointment = mapper.toEntity(appointmentDTO);
            Patient patient = patientRepository.findPatientById(patientId);
            Doctor doctor = doctorMapper.toEntity(doctorService.getDoctor(appointment.getDoctor().getId()));
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setAppointmentStatus(EAppointmentStatus.PENDING);

            String message = "Appointment request from " + patient.getFirstname() + " " + patient.getLastname() +
                    " for " + appointment.getDate() + " at " + appointment.getTime() + ".";

            try {
                Notification notification = new Notification();
                notification.setNotificationStatus(ENotificationStatus.SENT);
                notification.setSender(patient);
                notification.setRecipient(doctor);
                notification.setTitle("Appointment Request");
                notification.setMessage(message);
                notification.setSentAt(LocalDateTime.now());
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("ERROR saving notification "+e);
                throw new RuntimeException(e);
            }

            notificationService.sendNotification(message ,doctor.getId());
            return mapper.toDto(appointmentRepository.save(appointment));
        } catch (Exception e) {
            log.error("ERROR creating appointment request"+e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public AppointmentDTO approveAppointment(UUID appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + appointmentId));

            appointment.setAppointmentStatus(EAppointmentStatus.APPROVED);

            String message = "Your appointment request with Dr. " + appointment.getDoctor().getFirstname() + " " + appointment.getDoctor().getLastname() +
                    " for " + appointment.getDate() + " at " + appointment.getTime() + " has been approved.";

            try {
                Notification notification = new Notification();
                notification.setNotificationStatus(ENotificationStatus.SENT);
                notification.setSender(appointment.getDoctor());
                notification.setRecipient(appointment.getPatient());
                notification.setTitle("Appointment Approval");
                notification.setMessage(message);
                notification.setSentAt(LocalDateTime.now());
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("ERROR saving notification "+e);
                throw new RuntimeException(e);
            }

            notificationService.sendNotification(message ,appointment.getPatient().getId());


            return mapper.toDto(appointmentRepository.save(appointment));
        } catch (Exception e) {
            log.error("ERROR approving appointment request", e);
            throw new RuntimeException(e);
        }
    }
}
