package com.example.mapper;

import com.example.dto.MedicationDTO;
import com.example.entities.Medication;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Medication.class)
public interface AutoMedicationMapper extends EntityMapper<MedicationDTO, Medication>{
}
