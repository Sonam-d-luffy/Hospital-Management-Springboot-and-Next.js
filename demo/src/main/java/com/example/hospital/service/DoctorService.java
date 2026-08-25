package com.example.hospital.service;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.hospital.entities.Doctor;
import com.example.hospital.entities.Hospital;
import com.example.hospital.repositories.DoctorRepository;
import com.example.hospital.repositories.HospitalRepository;

@Service
public class DoctorService{
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final CloudinaryService cloudinaryService;
    public DoctorService(DoctorRepository doctorRepository, HospitalRepository hospitalRepository,CloudinaryService cloudinaryService){
        this.doctorRepository=doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.cloudinaryService=cloudinaryService;
    }

    public Doctor createDoctor(Long hospitalId , Doctor doctor, MultipartFile image){
        if(doctor.getName()==null || doctor.getName().isBlank()) throw new IllegalArgumentException("Name is required");
        if(image==null || image.isEmpty()) throw new IllegalArgumentException("image is required");
        if(doctor.getPhone()==null || doctor.getPhone().isBlank()) throw new IllegalArgumentException("phone is required");
        if(doctor.getEmail()==null || doctor.getEmail().isBlank()) throw new IllegalArgumentException("email is required");
        if (doctorRepository.existsByEmail(doctor.getEmail())) {
    throw new IllegalArgumentException("Doctor email already exists");
}
        Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        doctor.setHospital(hospital);
        String imageUrl = cloudinaryService.uploadImage(image);
        doctor.setImage(imageUrl);
        return doctorRepository.save(doctor);
    }
    public List<Doctor> getDoctors(Long hospitalId){
        Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        List<Doctor> doctors = hospital.getDoctors();
        return doctors;
    }
    
    public Doctor getDoctorDetails(Long id){
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        return doctorRepository.save(doctor);
    }
    public void deleteDoctor(Long id){
         if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found");
        }

        doctorRepository.deleteById(id);
    }
}