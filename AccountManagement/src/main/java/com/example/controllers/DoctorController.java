package com.example.controllers;

import com.example.dto.DoctorDTO;
import com.example.dto.request.PasswordRequest;
import com.example.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class DoctorController {
    @Autowired
    DoctorService doctorService;

    @PutMapping("/update-info/{id}")
    public DoctorDTO updateInfo(@PathVariable(value = "id") UUID id, @RequestBody DoctorDTO doctorDTO){

        DoctorDTO doctor = doctorService.getDoctorById(id);
        if (doctor != null) {
            return doctorService.updateInfos(doctorDTO);
        } else {
            return null;
        }
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody PasswordRequest passwordRequest){
    }

    @GetMapping("/get-doctor/{id}")
    public DoctorDTO findDoctorById(@PathVariable(value = "id") UUID id){
        return doctorService.getDoctorById(id);
    }
}
