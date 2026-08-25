package com.example.hospital.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    @GetMapping("/{id}/allDoctors")
    public ResponseEntity<List<Doctor>> allDoctors(@PathVariable Long id) throws IOException {
        List<Doctor> doctors = doctorService.getDoctors(id);
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/doctor/{id}")
    public ResponseEntity<Doctor> getDetails(@PathVariable Long id) throws IOException {
        Doctor doctor = doctorService.getDoctorDetails(id);
        return ResponseEntity.ok(doctor);
    }

    @DeleteMapping("/deleteDoctor/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id){
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted");
    }
}
