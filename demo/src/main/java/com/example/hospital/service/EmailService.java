package com.example.hospital.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }
    public void sendOTP(String email , String otp){
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Hospital Management Email verification");
        msg.setText(
                "Hello,\n\n" +
                "Your OTP is: " + otp +
                "\n\nThis OTP is valid for 5 minutes." +
                "\n\nDo not share it with anyone."
        );

        mailSender.send(msg);
    }
    public void sendAppointmentStatusEmail(
        String email,
        String patientName,
        String doctorName,
        String hospitalName,
        String status) {

    SimpleMailMessage message = new SimpleMailMessage();

    message.setTo(email);
    message.setSubject("Appointment Status Updated");

    message.setText(
            "Dear " + patientName + ",\n\n" +
            "Your appointment at " + hospitalName +
            " with Dr. " + doctorName +
            " has been " + status + ".\n\n" +
            "Thank you,\nHospital Management Team"
    );

    mailSender.send(message);
}
}
