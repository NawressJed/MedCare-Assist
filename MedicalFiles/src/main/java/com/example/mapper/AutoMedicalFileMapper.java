package com.example.mapper;

import com.example.dto.MedicalFileDTO;
import com.example.entities.MedicalFile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = MedicalFile.class)
public interface AutoMedicalFileMapper extends EntityMapper<MedicalFileDTO, MedicalFile> {
}
