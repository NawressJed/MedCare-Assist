package com.example.mapper;

import com.example.dto.PatientDTO;
import com.example.entities.Patient;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Patient.class)
public interface AutoPatientMapper extends EntityMapper<PatientDTO, Patient> {
}
