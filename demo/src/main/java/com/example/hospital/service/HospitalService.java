package com.example.hospital.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.hospital.entities.Hospital;
import com.example.hospital.entities.OTPVerification;
import com.example.hospital.entities.User;
import com.example.hospital.repositories.HospitalRepository;
import com.example.hospital.repositories.OtpVerificationRepository;
import com.example.hospital.repositories.UserRepository;

@Service
public class HospitalService {
    private final HospitalRepository hospitalRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GeocodingService geocodingService;
       private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
public HospitalService(HospitalRepository hospitalRepository,
                       CloudinaryService cloudinaryService,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       GeocodingService geocodingService, UserRepository userRepository,
                       OtpVerificationRepository otpRepository) {

    this.hospitalRepository = hospitalRepository;
    this.cloudinaryService = cloudinaryService;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.geocodingService = geocodingService;
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
}

    public Hospital createHospital(Hospital hospital ,MultipartFile image) {
    if (hospital.getName() == null || hospital.getName().isBlank()) {
        throw new IllegalArgumentException("Hospital name is required");
    }

    if (hospital.getEmail() == null || hospital.getEmail().isBlank()) {
        throw new IllegalArgumentException("Hospital email is required");
    }

    if (hospital.getPassword() == null || hospital.getPassword().isBlank()) {
        throw new IllegalArgumentException("Hospital password is required");
    }

    if (hospital.getBeds() <= 0) {
        throw new IllegalArgumentException("Beds must be greater than zero");
    }

    if (hospitalRepository.existsByEmail(hospital.getEmail())) {
        throw new IllegalArgumentException("Email already exists");
    }

    if (hospitalRepository.existsByRegistrationNumber(
            hospital.getRegistrationNumber())) {

        throw new IllegalArgumentException(
                "Registration number already exists");
    }
    
    OTPVerification otp = otpRepository.findByEmail(hospital.getEmail())
        .orElseThrow(() ->
            new IllegalArgumentException("Please verify your email first"));

if (!otp.isVerified()) {
    throw new IllegalArgumentException("Email not verified");
}
if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
    throw new IllegalArgumentException("OTP has expired");
}
String imageUrl = cloudinaryService.uploadImage(image);
    double[] coordinates = geocodingService.getCoordinates(hospital.getAddress());

    hospital.setImage(imageUrl);
hospital.setLatitude(coordinates[0]);
hospital.setLongitude(coordinates[1]);
    hospital.setPassword(passwordEncoder.encode(hospital.getPassword()));
    otpRepository.delete(otp);
    otpRepository.flush();
    return hospitalRepository.save(hospital);
    
}

public Hospital login(String email, String password) {

        Hospital user = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return hospitalRepository.save(user);
    }

    public Page<Hospital> getNearbyHospital(Long id, Pageable pageable){
        List<Hospital> allHospitals = hospitalRepository.findAll();
        final double radius = 50;
       User user = userRepository.findById(id)
        .orElseThrow(() ->
            new IllegalArgumentException("User not found"));
        List<Hospital> nearby = allHospitals.stream()
            .filter(hospital ->
                    calculateDistance(
                            user.getLatitude(),
                            user.getLongitude(),
                            hospital.getLatitude(),
                            hospital.getLongitude()
                    ) <= radius)
            .toList();
    int start = (int) pageable.getOffset();
    if (start >= nearby.size()) {
    return new PageImpl<>(List.of(), pageable, nearby.size());
}
int end = Math.min(start + pageable.getPageSize(), nearby.size());

    List<Hospital> pageContent = nearby.subList(start, end);

    return new PageImpl<>(pageContent, pageable, nearby.size());
    }

public Page<Hospital> getHospital(String address , Pageable pageable){
    if (address == null || address.isBlank()) {
    throw new IllegalArgumentException("Address is required");
}
    double[] coords = geocodingService.getCoordinates(address);

double userLat = coords[0];
double userLong = coords[1];
List<Hospital> nearby = hospitalRepository.findAll()
        .stream()
        .filter(hospital ->
                calculateDistance(
                        userLat,
                        userLong,
                        hospital.getLatitude(),
                        hospital.getLongitude()
                ) <= 50)
        .toList();

        int start = (int) pageable.getOffset();

if (start >= nearby.size()) {
       return new PageImpl<>(List.of(), pageable, nearby.size());
}


    int end = Math.min(start + pageable.getPageSize(), nearby.size());

    List<Hospital> pageContent = nearby.subList(start, end);

    return new PageImpl<>(pageContent, pageable, nearby.size());
    }

    private double calculateDistance(
        double lat1,
        double lon1,
        double lat2,
        double lon2) {

    final int R = 6371;

    double latDistance = Math.toRadians(lat2 - lat1);
    double lonDistance = Math.toRadians(lon2 - lon1);

    double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(Math.toRadians(lat1))
            * Math.cos(Math.toRadians(lat2))
            * Math.sin(lonDistance / 2)
            * Math.sin(lonDistance / 2);

    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

public Hospital getHospialDetail(Long id){
    Hospital hospital = hospitalRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hospital does not exists"));
    return hospital;
}

}

