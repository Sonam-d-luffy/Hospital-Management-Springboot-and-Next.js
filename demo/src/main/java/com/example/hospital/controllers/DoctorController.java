package com.example.hospital.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.ResponseEntity;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import com.example.hospital.entities.Doctor;
import com.example.hospital.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorService doctorService;
    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }
    @PostMapping("/create/{hospitalId}")
    public ResponseEntity<Doctor> create(
        @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam MultipartFile image,
            @RequestParam String specialization,
            @RequestParam double experience,
            @RequestParam String qualification,@PathVariable Long hospitalId
    ) throws IOException {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setQualification(qualification);
        doctor.setExperience(experience);
        Doctor createdDoctor = doctorService.createDoctor(hospitalId,doctor,image);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDoctor);

    }
}
