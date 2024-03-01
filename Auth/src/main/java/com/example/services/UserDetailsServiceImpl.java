package com.example.services;

import com.example.entities.UserEntity;
import com.example.mapper.AutoUserMapper;
import com.example.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AutoUserMapper autoUserMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
        boolean enabled = !autoUserMapper.toDto(user).isEnabled();
        UserDetails userDetails = User.withUsername(user.getEmail())
                .password(user.getPassword())
                .disabled(enabled)
                .authorities(user.getRole().name())
                .build();

        return userDetails;
    }
}
