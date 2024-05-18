package com.example.mapper;

import com.example.dto.DoctorDTO;
import com.example.entities.Doctor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Doctor.class)
public interface AutoDoctorMapper extends EntityMapper<DoctorDTO, Doctor> {
}
