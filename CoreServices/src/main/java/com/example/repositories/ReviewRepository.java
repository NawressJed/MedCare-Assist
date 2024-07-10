package com.example.repositories;

import com.example.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    @Query(value = "SELECT r.* FROM review AS r WHERE r.doctor_id = :doctorId", nativeQuery = true)
    List<Review> findReviewByDoctorId(UUID doctorId);

    @Query(value = "SELECT AVG(r.rating) FROM review AS r WHERE r.doctor_id = :doctorId", nativeQuery = true)
    Double findAverageRatingByDoctorId(UUID doctorId);
}
