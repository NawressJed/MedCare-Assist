package com.example.controllers;

import com.example.dto.DoctorDTO;
import com.example.dto.UserDTO;
import com.example.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class DoctorController {
    @Autowired
    DoctorService doctorService;

    @PostMapping("/add-doctor")
    public DoctorDTO createDoctor(@RequestBody  DoctorDTO doctorDTO) {
        return doctorService.createDoctor(doctorDTO);
    }

    @GetMapping("/get-all-doctors")
    public List<DoctorDTO> getAllDoctors(){
        return doctorService.getAllDoctors();
    }

    @GetMapping("/get-doctor/{id}")
    public DoctorDTO findDoctorById(@PathVariable(value = "id") UUID id){
        return doctorService.findDoctorById(id);
    }

    @GetMapping("/get-user-by-email/{email}")
    public UserDTO findUserByEmail(@PathVariable(value = "email") String email){
        return doctorService.findDoctorByEmail(email);
    }

    @PutMapping("/update-doctor/{id}")
    public DoctorDTO updateDoctor(@PathVariable(value = "id") UUID id, @RequestBody DoctorDTO doctorDTO){

        DoctorDTO doctor = doctorService.findDoctorById(id);
        if (doctor != null) {
            return doctorService.updateDoctor(doctorDTO);
        } else {
            return null;
        }
    }

    @DeleteMapping("/delete-doctor/{id}")
    public void deleteDoctor(@PathVariable UUID id){
        doctorService.deleteDoctor(id);
    }
}
