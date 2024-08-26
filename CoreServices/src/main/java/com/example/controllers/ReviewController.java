package com.example.controllers;

import com.example.dto.ReviewDTO;
import com.example.services.ReviewService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Log4j2
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @PostMapping("/add-review/patient/{patientId}/doctor/{doctorId}/appointment/{appointmentId}")
    @PreAuthorize("hasRole('ROLE_PATIENT')")
    public ReviewDTO createReview(@PathVariable UUID patientId,
                                  @PathVariable UUID doctorId,
                                  @PathVariable UUID appointmentId,
                                  @RequestBody ReviewDTO reviewDTO) {
        try {
            log.info("Received patientId: {}", patientId);
            log.info("Received doctorId: {}", doctorId);
            log.info("Received appointmentId: {}", appointmentId);
            log.info("Received reviewDTO: {}", reviewDTO);

            return reviewService.createReview(patientId, doctorId, appointmentId, reviewDTO);
        } catch (Exception e) {
            log.error("ERROR creating the review " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-reviews/{id}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public List<ReviewDTO> getReviewsByDoctor(@PathVariable(value = "id") UUID id) {
        try {
            return reviewService.getMyReviews(id);
        } catch (Exception e) {
            log.error("ERROR getting all doctor's reviews " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-review/{id}")
    public ReviewDTO getReviewByID(@PathVariable(value = "id") UUID id) {
        try {
            return reviewService.getReview(id);
        } catch (Exception e) {
            log.error("ERROR getting review by ID: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/average-rating/{doctorId}")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public Double getAverageRating(@PathVariable UUID doctorId) {
        try {
            return reviewService.getAverageRating(doctorId);
        } catch (Exception e) {
            log.error("ERROR calculating doctor's rating average: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete-review/{id}")
    public void deleteReview(@PathVariable UUID id){
        try {
            reviewService.deleteReview(id);
        } catch (Exception e) {
            log.error("ERROR deleting review by its ID: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-reviews/count/{id}")
    public int getReviewCount(@PathVariable(value = "id") UUID doctorId) {
        return reviewService.getRatingCount(doctorId);
    }
}
