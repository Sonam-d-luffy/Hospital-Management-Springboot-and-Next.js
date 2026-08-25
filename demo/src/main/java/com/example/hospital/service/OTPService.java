package com.example.hospital.service;

import java.util.Random;

import org.springframework.stereotype.Service;

import com.example.hospital.entities.OTPVerification;
import com.example.hospital.repositories.OtpVerificationRepository;
import java.time.LocalDateTime;

@Service
public class OTPService {
private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;

    public OTPService(OtpVerificationRepository otpRepository,
                      EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    public void sendOTPService(String email){
    String otp = String.valueOf(100000 + new Random().nextInt(900000));
    OTPVerification verification = otpRepository.findByEmail(email)
            .orElse(new OTPVerification());
    verification.setEmail(email);
    verification.setOtp(otp);
    verification.setVerified(false);
    verification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
    verification.setLastSentTime(LocalDateTime.now());
    otpRepository.save(verification);
    emailService.sendOTP(email , otp);

    }
    public void verifyOtp(String email, String enteredOtp) {

    OTPVerification otp = otpRepository.findByEmail(email)
            .orElseThrow(() ->
                    new IllegalArgumentException("OTP not found"));

    if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
        throw new IllegalArgumentException("OTP expired");
    }

    if (!otp.getOtp().equals(enteredOtp)) {
        throw new IllegalArgumentException("Invalid OTP");
    }

    otp.setVerified(true);

    otpRepository.save(otp);
}

public void resendOTP(String email){

    OTPVerification verification =
            otpRepository.findByEmail(email)
                    .orElseThrow(()->
                    new IllegalArgumentException("Please send OTP first"));

    if(LocalDateTime.now().isBefore(
            verification.getLastSentTime().plusSeconds(30))){
        throw new IllegalArgumentException(
                "Please wait 30 seconds before requesting another OTP.");
    }

    String otp =
            String.valueOf(100000 + new Random().nextInt(900000));

    verification.setOtp(otp);
    verification.setVerified(false);
    verification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
    verification.setLastSentTime(LocalDateTime.now());

    otpRepository.save(verification);

    emailService.sendOTP(email, otp);
}
}
