package com.example.hospital.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.hospital.entities.Appointment;
import com.example.hospital.entities.AppointmentStatus;
import com.example.hospital.entities.Doctor;
import com.example.hospital.entities.Hospital;
import com.example.hospital.entities.User;
import com.example.hospital.repositories.AppointmentRepository;
import com.example.hospital.repositories.DoctorRepository;
import com.example.hospital.repositories.HospitalRepository;
import com.example.hospital.repositories.UserRepository;

@Service
public class AppointmentService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final HospitalRepository hospitalRepository;
    private final EmailService emailService;
    public AppointmentService(UserRepository userRepository, DoctorRepository doctorRepository,AppointmentRepository appointmentRepository,HospitalRepository hospitalRepository,EmailService emailService){
         this.userRepository = userRepository;
         this.doctorRepository = doctorRepository;
         this.appointmentRepository = appointmentRepository;
         this.hospitalRepository = hospitalRepository;
         this.emailService = emailService;
    }

    public Appointment createAppointment(Appointment appointment, Long userId, Long doctorId){
        
        if(appointment.getDate()==null ){
            throw new IllegalArgumentException("Date is required"); 
        }
        if(appointment.getTime()==null ){
            throw new IllegalArgumentException("Time is required"); 
        }
        if(appointment.getSymptoms()==null || appointment.getSymptoms().isBlank()){
            throw new IllegalArgumentException("Symptoms is required"); 
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        if(appointmentRepository.existsByDoctorAndDateAndTime(
        doctor,
        appointment.getDate(),
        appointment.getTime())){
            throw new IllegalArgumentException("Appointment already existing");
        }
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setHospital(doctor.getHospital());
        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    public Page<Appointment> getAppointmentUser(Long userId,Pageable pageable){
        User user = userRepository.findById(userId)
        .orElseThrow(() ->
                new IllegalArgumentException("User not found"));
        Page<Appointment> app = appointmentRepository.findByUser(user,pageable);

        return app;
       }

    public Page<Appointment> getAppointmentHospital(Long hospitalId,Pageable pageable){
        Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow(() ->
                new IllegalArgumentException("Hospital not found"));
        Page<Appointment> app = appointmentRepository.findByHospital(hospital,pageable);

        return app;
       }

    public Page<Appointment> getAppointmentDoctor(Long doctorId,Pageable pageable){
        Doctor hospital = doctorRepository.findById(doctorId).orElseThrow(() ->
                new IllegalArgumentException("Doctor not found"));
        Page<Appointment> app = appointmentRepository.findByDoctor(hospital,pageable);

        return app;
       }

    public Appointment updateStatus(Long id, AppointmentStatus status){
        Appointment app = appointmentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Appointment does not exists"));
        app.setStatus(status);
        emailService.sendAppointmentStatusEmail(
        app.getUser().getEmail(),
        app.getUser().getName(),
        app.getDoctor().getName(),
        app.getHospital().getName(),
        status.name()
        );
        return appointmentRepository.save(app);
    }
    
}
