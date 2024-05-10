package com.example.services.impl;

import com.example.dto.AppointmentDTO;
import com.example.entities.Appointment;
import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.example.enums.EAppointmentStatus;
import com.example.enums.ERole;
import com.example.mapper.AutoAppointmentMapper;
import com.example.repositories.AppointmentRepository;
import com.example.repositories.DoctorRepository;
import com.example.repositories.PatientRepository;
import com.example.repositories.UserRepository;
import com.example.services.AppointmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    AutoAppointmentMapper mapper;
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
            return null;
        }
    }

    @Override
    public AppointmentDTO requestAppointment(UUID id, AppointmentDTO appointmentDTO) {
        try {
            Doctor doc = doctorRepository.findDoctorById(appointmentDTO.getDoctor().getId());
            Patient patient = patientRepository.findPatientById(id);
            if (patient != null) {
                Appointment appointment = mapper.toEntity(appointmentDTO);
                appointment.setDoctor(doc);
                appointment.setPatient(patient);
                appointment.setAppointmentStatus(EAppointmentStatus.PENDING);
                return mapper.toDto(appointmentRepository.save(appointment));
            }
            logger.error("No such patient with this ID = "+id);
            return null;
        } catch (Exception e) {
            logger.error("ERROR requesting appointment" + e);
            return null;
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
}
