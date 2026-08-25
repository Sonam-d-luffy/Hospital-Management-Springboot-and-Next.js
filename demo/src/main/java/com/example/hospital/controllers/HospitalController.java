package com.example.hospital.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.hospital.entities.Hospital;
import com.example.hospital.service.HospitalService;


@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private HospitalService hospitalService;
    public HospitalController(HospitalService hospitalService) {
    this.hospitalService = hospitalService;
}
    @PostMapping("/create")
    public ResponseEntity<Hospital> create(
        @RequestParam String name,
            @RequestParam String email,
            @RequestParam int beds,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String registrationNumber,
            @RequestParam MultipartFile image ,
            @RequestParam String password
    ) throws IOException {
        Hospital hospital = new Hospital();
        hospital.setName(name);
        hospital.setEmail(email);
        hospital.setBeds(beds);
        hospital.setPhone(phone);
        hospital.setAddress(address);
        hospital.setRegistrationNumber(registrationNumber);
        hospital.setPassword(password);
        Hospital createdHospital = hospitalService.createHospital(hospital , image);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHospital);
    }

    @PostMapping("/login")
    public ResponseEntity<Hospital> login(
            @RequestParam String email,
            @RequestParam String password) {

        Hospital hospital = hospitalService.login(email, password);

        return ResponseEntity.ok(hospital);
    }

    @GetMapping("/nearby/{id}")
    public ResponseEntity<Map<String,Object>> getHospital(
        @PathVariable Long id,
        Pageable pageable
    ){
        Page<Hospital> page = hospitalService.getNearbyHospital(id, pageable);

    Map<String,Object> response = new HashMap<>();

    response.put("hospitals", page.getContent());
    response.put("currentPage", page.getNumber());
    response.put("totalPages", page.getTotalPages());
    response.put("totalHospitals", page.getTotalElements());
    response.put("hasNext", page.hasNext());
    response.put("hasPrevious", page.hasPrevious());

    return ResponseEntity.ok(response);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<Hospital> getDetails(
        @PathVariable Long id
    ){
        return ResponseEntity.ok(
            hospitalService.getHospialDetail(id)
        );
    }

     @GetMapping("/getHospital")
     public ResponseEntity<Map<String,Object>> getHospitalNearby(
        @RequestParam String address,
        Pageable pageable
    ){
        Page<Hospital> page = hospitalService.getHospital(address, pageable);

    Map<String,Object> response = new HashMap<>();

    response.put("hospitals", page.getContent());
    response.put("currentPage", page.getNumber());
    response.put("totalPages", page.getTotalPages());
    response.put("totalHospitals", page.getTotalElements());
    response.put("hasNext", page.hasNext());
    response.put("hasPrevious", page.hasPrevious());

    return ResponseEntity.ok(response);
    }

}
