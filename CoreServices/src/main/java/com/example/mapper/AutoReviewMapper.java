package com.example.mapper;

import com.example.dto.ReviewDTO;
import com.example.entities.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = Review.class)
public interface AutoReviewMapper extends EntityMapper<ReviewDTO, Review>{
    @Override
    @Mapping(source = "appointment.id", target = "appointmentId")
    ReviewDTO toDto(Review review);

    @Override
    @Mapping(source = "appointmentId", target = "appointment.id")
    Review toEntity(ReviewDTO reviewDTO);
}
