package com.example.services.impl;

import com.example.dto.ReviewDTO;
import com.example.entities.Doctor;
import com.example.entities.Notification;
import com.example.entities.Review;
import com.example.enums.ENotificationStatus;
import com.example.mapper.AutoReviewMapper;
import com.example.repositories.*;
import com.example.services.NotificationService;
import com.example.services.ReviewService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    ReviewRepository repository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    NotificationService notificationService;
    @Autowired
    AutoReviewMapper mapper;

    @Override
    public ReviewDTO createReview(UUID patientId, UUID doctorId, UUID appointmentId, ReviewDTO reviewDTO) {
        try {
            Review review = mapper.toEntity(reviewDTO);
            review.setPatient(patientRepository.findPatientById(patientId));
            review.setDoctor(doctorRepository.findDoctorById(doctorId));
            review.setAppointment(appointmentRepository.findAppointmentById(appointmentId));

            String message = review.getPatient().getFirstname() + " " + review.getPatient().getLastname() + " left you a new review.";

            Notification notification = new Notification();

            try {
                notification.setNotificationStatus(ENotificationStatus.UNREAD);
                notification.setSender(review.getPatient());
                notification.setRecipient(review.getDoctor());
                notification.setTitle("New Review Received");
                notification.setMessage(message);
                notificationRepository.save(notification);
            } catch (Exception e) {
                log.error("ERROR saving notification " + e);
                throw new RuntimeException(e);
            }

            notificationService.sendNotification("New Review Received", message, review.getDoctor().getId(), null);
            return mapper.toDto(repository.save(review));
        } catch (Exception e) {
            log.error("ERROR creating review: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<ReviewDTO> getMyReviews(UUID doctorId) {
        List<ReviewDTO> reviews = new ArrayList<>();
        try {
            reviews = mapper.toDto(repository.findReviewByDoctorId(doctorId));
            return reviews;
        } catch (Exception e) {
            log.error("ERROR retrieving doctor's review " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public ReviewDTO getReview(UUID reviewId) {
        try {
            Review review = repository.findById(reviewId).orElseThrow();
            return mapper.toDto(review);
        } catch (Exception e) {
            log.error("ERROR retrieving review " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public Double getAverageRating(UUID doctorId) {
        try {
            Doctor doctor = doctorRepository.findDoctorById(doctorId);
            return repository.findAverageRatingByDoctorId(doctor.getId());
        } catch (Exception e) {
            log.error("ERROR calculating doctor's rating average " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getRatingCount(UUID id) {
        try {
            return repository.countReviewsByDoctorId(id);
        }catch (Exception e){
            log.error("Failed counting doctor's total review");
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteReview(UUID reviewId) {
        try {
            repository.deleteById(reviewId);
        } catch (Exception e) {
            log.error("ERROR deleting review with ID : " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
