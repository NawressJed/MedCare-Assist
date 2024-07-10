package com.example.mapper;

import com.example.dto.ScheduleDTO;
import com.example.entities.Schedule;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Schedule.class)
public interface AutoScheduleMapper extends EntityMapper<ScheduleDTO, Schedule>{
}
