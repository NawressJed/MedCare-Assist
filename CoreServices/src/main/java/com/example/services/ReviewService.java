package com.example.services;

import com.example.dto.ReviewDTO;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDTO createReview(UUID patientId, UUID doctorId, UUID appointmentId, ReviewDTO reviewDTO);
    List<ReviewDTO> getMyReviews(UUID doctorId);
    ReviewDTO getReview(UUID reviewId);
    Double getAverageRating(UUID doctorId);
    int getRatingCount(UUID id);
    void deleteReview(UUID reviewId);
}
