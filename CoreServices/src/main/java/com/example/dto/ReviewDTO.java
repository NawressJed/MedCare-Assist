package com.example.dto;

import com.example.entities.Doctor;
import com.example.entities.Patient;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private UUID id;
    private int rating;
    private String reviewText;
    private String timestamp;
    private UUID appointmentId;
    private Doctor doctor;
    private Patient patient;

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
