package com.example.hospital.controllers;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import com.example.hospital.service.OTPService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OTPService otpService;

    public OtpController(OTPService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {

        otpService.sendOTPService(email);

        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify")
public ResponseEntity<String> verifyOtp(
        @RequestParam String email,
        @RequestParam String otp) {

    otpService.verifyOtp(email, otp);

    return ResponseEntity.ok("OTP verified successfully");
}
@PostMapping("/resend")
public ResponseEntity<String> resendOtp(
        @RequestParam String email){

    otpService.resendOTP(email);

    return ResponseEntity.ok("OTP resent successfully");
}
}
