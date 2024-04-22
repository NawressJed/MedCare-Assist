package com.example.mapper;

import com.example.dto.UserDTO;
import com.example.entities.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = UserEntity.class)
public interface AutoUserMapper extends EntityMapper<UserDTO, UserEntity>{

}

