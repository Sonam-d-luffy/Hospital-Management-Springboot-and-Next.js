package com.example.hospital.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Appointment {
   
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Hospital hospital;
    @ManyToOne
    private Doctor doctor;
    private LocalTime time;
    private LocalDate date;
    @ManyToOne
    private User user;
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    @NotBlank
    private String symptoms;
     
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Hospital getHospital() {
        return hospital;
    }
    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }
    public Doctor getDoctor() {
        return doctor;
    }
    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
    public LocalTime getTime() {
        return time;
    }
    public void setTime(LocalTime time) {
        this.time = time;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public AppointmentStatus getStatus() {
        return status;
    }
    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
    public String getSymptoms() {
        return symptoms;
    }
    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}
