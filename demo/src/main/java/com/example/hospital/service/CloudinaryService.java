package com.example.hospital.service;

import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }
    public String uploadImage(MultipartFile file){
        if(file == null || file.isEmpty()){
            throw new IllegalArgumentException("Image is required");
        }
        try {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of("folder", "hospital-management")
        );

        return uploadResult.get("secure_url").toString();

    } catch (Exception e) {
        throw new RuntimeException("Failed to upload image", e);
    }
    }

     public void deleteImage(String publicId) {

    try {
        cloudinary.uploader().destroy(publicId, Map.of());
    } catch (Exception e) {
        throw new RuntimeException("Failed to delete image", e);
    }
}
}
