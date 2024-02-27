package com.example.mapper;

import com.example.entities.UserEntity;
import com.example.dto.UserDetailsImpl;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", imports = UserEntity.class)
public interface AutoUserMapper extends EntityMapper<UserDetailsImpl, UserEntity>{

}

