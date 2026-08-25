package com.example.hospital.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hospital.entities.OTPVerification;
import com.example.hospital.entities.User;
import com.example.hospital.repositories.OtpVerificationRepository;
import com.example.hospital.repositories.UserRepository;



@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GeocodingService geocodingService;
    private final OtpVerificationRepository otpRepository;
    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,GeocodingService geocodingService,OtpVerificationRepository otpRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.geocodingService = geocodingService;
        this.otpRepository = otpRepository;
    }
    public User register(User user) {

        if (user.getName() == null || user.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (user.getAddress() == null || user.getAddress().isBlank()) {
            throw new IllegalArgumentException("Address is required");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        OTPVerification otp = otpRepository.findByEmail(user.getEmail())
        .orElseThrow(() ->
            new IllegalArgumentException("Please verify your email first"));

if (!otp.isVerified()) {
    throw new IllegalArgumentException("Email not verified");
}
if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
    throw new IllegalArgumentException("OTP has expired");
}
        double[] coordinates = geocodingService.getCoordinates(user.getAddress());
        user.setLatitude(coordinates[0]);
        user.setLongitude(coordinates[1]);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        otpRepository.delete(otp);
        otpRepository.flush();
        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if(!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return userRepository.save(user);
    }
}