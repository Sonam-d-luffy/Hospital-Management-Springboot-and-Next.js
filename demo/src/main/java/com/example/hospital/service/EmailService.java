package com.example.hospital.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${brevo.api-key}")
    private String apiKey;

    @Value("${brevo.sender-email}")
    private String senderEmail;

    @Value("${brevo.sender-name}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    private void sendEmail(String to, String subject, String content) {

        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("api-key", apiKey);

        Map<String, String> sender = Map.of(
                "name", senderName,
                "email", senderEmail
        );

        Map<String, String> recipient = Map.of(
                "email", to
        );

        Map<String, Object> requestBody = Map.of(
                "sender", sender,
                "to", List.of(recipient),
                "subject", subject,
                "textContent", content
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        restTemplate.postForEntity(
                url,
                request,
                String.class
        );
    }

    public void sendOTP(String email, String otp) {

        String content =
                "Hello,\n\n" +
                "Your OTP is: " + otp +
                "\n\nThis OTP is valid for 5 minutes." +
                "\n\nDo not share it with anyone.";

        sendEmail(
                email,
                "Hospital Management Email Verification",
                content
        );
    }

    public void sendAppointmentStatusEmail(
            String email,
            String patientName,
            String doctorName,
            String hospitalName,
            String status) {

        String content =
                "Dear " + patientName + ",\n\n" +
                "Your appointment at " + hospitalName +
                " with Dr. " + doctorName +
                " has been " + status + ".\n\n" +
                "Thank you,\n" +
                "Hospital Management Team";

        sendEmail(
                email,
                "Appointment Status Updated",
                content
        );
    }
}