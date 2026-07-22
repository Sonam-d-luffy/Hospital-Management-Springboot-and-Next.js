package com.example.hospital.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate;

    @Value("${opencage.api.key}")
    private String apiKey;

    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double[] getCoordinates(String address) {

        String url = "https://api.opencagedata.com/geocode/v1/json?q="
                + address.replace(" ", "+")
                + "&key="
                + apiKey;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        List<?> results = (List<?>) response.get("results");

        if (results == null || results.isEmpty()) {
            throw new RuntimeException("Address not found.");
        }

        Map<?, ?> firstResult = (Map<?, ?>) results.get(0);

        Map<?, ?> geometry = (Map<?, ?>) firstResult.get("geometry");

        double latitude = ((Number) geometry.get("lat")).doubleValue();
        double longitude = ((Number) geometry.get("lng")).doubleValue();

        return new double[] { latitude, longitude };
    }
}