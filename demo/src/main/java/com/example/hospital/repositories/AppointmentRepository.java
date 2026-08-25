package com.example.hospital.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hospital.entities.Appointment;
import com.example.hospital.entities.AppointmentStatus;
import com.example.hospital.entities.User;
import com.example.hospital.entities.Hospital;
import com.example.hospital.entities.Doctor;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface  AppointmentRepository  extends JpaRepository<Appointment, Long>{
    Page<Appointment> findByUser(User user, Pageable pageable);
    Page<Appointment> findByHospital(Hospital hospital,Pageable pageable);
    Page<Appointment> findByDoctor(Doctor doctor,Pageable pageable);

    boolean existsByDoctorAndDateAndTime(
            Doctor doctor,
            LocalDate date,
            LocalTime time);

    Page<Appointment> findByHospitalAndStatus(
        Hospital hospital,
        AppointmentStatus status,
        Pageable pageable);

Page<Appointment> findByDoctorAndStatus(
        Doctor doctor,
        AppointmentStatus status,
        Pageable pageable);

Page<Appointment> findByUserAndStatus(
        User user,
        AppointmentStatus status,
        Pageable pageable);
}
