package com.example.hospital.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hospital.entities.User;
import com.example.hospital.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody User user) {

        User registeredUser = userService.register(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(
            @RequestParam String email,
            @RequestParam String password) {

        User user = userService.login(email, password);

        return ResponseEntity.ok(user);
    }
}
