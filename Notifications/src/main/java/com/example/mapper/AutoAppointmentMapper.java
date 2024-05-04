package com.example.mapper;

import com.example.dto.AppointmentDTO;
import com.example.entities.Appointment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = Appointment.class)
public interface AutoAppointmentMapper extends EntityMapper<AppointmentDTO, Appointment>{
}
