package com.example.hospital.repositories;

//import org.springframework.stereotype.Repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hospital.entities.Hospital;


//@Repository
public interface HospitalRepository extends JpaRepository<Hospital , Long>{
    Optional<Hospital> findByEmail(String email);
    Optional<Hospital> findByRegistrationNumber(String registrationNumber);
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
}
