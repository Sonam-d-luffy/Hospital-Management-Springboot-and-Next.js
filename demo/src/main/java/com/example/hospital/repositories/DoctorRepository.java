package com.example.hospital.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hospital.entities.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsById(Long id);
}
