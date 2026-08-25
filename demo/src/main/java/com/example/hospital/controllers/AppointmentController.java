package com.example.hospital.controllers;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.entities.Appointment;
import com.example.hospital.entities.AppointmentStatus;
import com.example.hospital.service.AppointmentService;
import com.example.hospital.service.HospitalService;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    private final HospitalService hospitalService;
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService, HospitalService hospitalService){
        this.appointmentService = appointmentService;
        this.hospitalService = hospitalService;
    }

    @PostMapping("/create")
    public ResponseEntity<Appointment> create(
         @RequestParam Long userId,
        @RequestParam Long doctorId,
        @RequestParam LocalDate date,
        @RequestParam LocalTime time,
        @RequestParam String symptoms) {

    Appointment appointment = new Appointment();
    appointment.setDate(date);
    appointment.setTime(time);
    appointment.setSymptoms(symptoms);

    Appointment bookedAppointment = appointmentService.createAppointment(
            appointment,
            userId,
            doctorId
    );
    return ResponseEntity.status(HttpStatus.CREATED).body(bookedAppointment);
        }

    @GetMapping("/getAppointmentUser/{userId}")
    public ResponseEntity<Map<String,Object>> getAppUser(
        @PathVariable Long userId,
        Pageable pageable
    ){
        Page<Appointment> page = appointmentService.getAppointmentUser(userId, pageable);
        Map<String,Object> response = new HashMap<>();

    response.put("appointments", page.getContent());
    response.put("currentPage", page.getNumber());
    response.put("totalPages", page.getTotalPages());
    response.put("totalHospitals", page.getTotalElements());
    response.put("hasNext", page.hasNext());
    response.put("hasPrevious", page.hasPrevious());

    return ResponseEntity.ok(response);
    }
    @GetMapping("/getAppointmentHospital/{hospitalId}")
   public ResponseEntity<Map<String,Object>> getAppHospital(
        @PathVariable Long hospitalId,
        Pageable pageable
    ){
        Page<Appointment> page = appointmentService.getAppointmentHospital(hospitalId, pageable);
        Map<String,Object> response = new HashMap<>();

    response.put("appointments", page.getContent());
    response.put("currentPage", page.getNumber());
    response.put("totalPages", page.getTotalPages());
    response.put("totalHospitals", page.getTotalElements());
    response.put("hasNext", page.hasNext());
    response.put("hasPrevious", page.hasPrevious());

    return ResponseEntity.ok(response);
    }

    @GetMapping("/getAppointmentDoctor/{doctorId}")
    public ResponseEntity<Map<String,Object>> getAppDoctor(
        @PathVariable Long doctorId,
        Pageable pageable
    ){
        Page<Appointment> page = appointmentService.getAppointmentDoctor(doctorId, pageable);
        Map<String,Object> response = new HashMap<>();

    response.put("appointments", page.getContent());
    response.put("currentPage", page.getNumber());
    response.put("totalPages", page.getTotalPages());
    response.put("totalHospitals", page.getTotalElements());
    response.put("hasNext", page.hasNext());
    response.put("hasPrevious", page.hasPrevious());

    return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
        @PathVariable Long id,
        @RequestParam AppointmentStatus status
    ){
        return ResponseEntity.ok(appointmentService.updateStatus(id , status));
    }
   
    
}
