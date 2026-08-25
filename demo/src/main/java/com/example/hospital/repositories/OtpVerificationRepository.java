package com.example.hospital.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hospital.entities.OTPVerification;

public interface OtpVerificationRepository
        extends JpaRepository<OTPVerification, Long> {

    Optional<OTPVerification> findByEmail(String email);
}