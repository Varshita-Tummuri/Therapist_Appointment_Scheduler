package com.example.Backend_AppointmentScheduler.controller;

import com.example.Backend_AppointmentScheduler.model.BookAppointments;
import com.example.Backend_AppointmentScheduler.model.Therapist;
import com.example.Backend_AppointmentScheduler.model.User;
import com.example.Backend_AppointmentScheduler.repositories.TherapistAvailabilityRepository;
import com.example.Backend_AppointmentScheduler.repositories.TherapistRepository;
import com.example.Backend_AppointmentScheduler.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Backend_AppointmentScheduler.service.userService;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "${FRONTEND_URL}")
@RestController
@RequestMapping("/auth")
public class userController {
    @Autowired
    private userService service;
    @Autowired
    private TherapistRepository therapistRepository;
    @Autowired
    private TherapistAvailabilityRepository availabilityRepository;
    @Autowired
    private userRepository repository;

    // userController.java — login method
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = service.login(request.getEmail(), request.getPassword());
        if (user != null) {
            LoginResponse res = new LoginResponse(true, "Login Successful", user.getRole(), user.getId());
            res.setName(user.getName());   // ← ADD
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(false, "Invalid credentials", null, 0));
    }

    // userController.java
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = new ArrayList<>();
        repository.findAll().forEach(users::add);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return repository.findById(id)
                .map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Basic validation
        if (request.getName()     == null || request.getName().isBlank() ||
                request.getEmail()    == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank() ||
                request.getRole()     == null || request.getRole().isBlank()) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }
        Time availableFrom = null;
        Time availableTo   = null;

        if ("Therapist".equalsIgnoreCase(request.getRole())) {
            if (request.getAvailableFrom() == null || request.getAvailableTo() == null) {
                return ResponseEntity.badRequest().body("Availability times are required for therapists.");
            }
            availableFrom = Time.valueOf(request.getAvailableFrom() + ":00");
            availableTo   = Time.valueOf(request.getAvailableTo()   + ":00");
        }
        User saved = service.register(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole(),
                availableFrom,
                availableTo
        );
        if (saved == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered.");
        }
        return ResponseEntity.ok(new LoginResponse(true, "Registration successful", saved.getRole(), saved.getId()));
    }

    @PostMapping("/bookAppointment")
    public ResponseEntity<?> bookAppointment(@RequestBody BookRequest request) {

        BookAppointments appointment = service.bookAppointment(
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getUserId(),
                request.getTherapistId()
        );

        if (appointment == null) {
            return ResponseEntity.badRequest().body("Slot not available");
        }

        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/cancelAppointment/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable int id) {
        String result = service.cancelAppointment(id);
        return switch (result) {
            case "NOT_FOUND" -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found");
            case "ALREADY_CANCELLED" -> ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Appointment is already cancelled");
            default -> ResponseEntity.ok("Appointment cancelled successfully");
        };
    }

    @GetMapping("/appointments/user/{userId}")
    public ResponseEntity<List<BookAppointments>> getUserAppointments(@PathVariable int userId) {
        return ResponseEntity.ok(service.getAppointmentsByUser(userId));
    }

    @PostMapping("/therapist/availability")
    public ResponseEntity<?> setAvailability(@RequestBody TherapistAvailability request) {

        TherapistAvailability a = service.setAvailability(
                request.getTherapistId(),
                request.getDate(),
                request.getAvailableFrom(),
                request.getAvailableTo()
        );

        return ResponseEntity.ok(a);
    }

    @GetMapping("/therapist/{therapistId}/availability")
    public ResponseEntity<?> getAvailability(
            @PathVariable int therapistId,
            @RequestParam String date) {

        LocalDate d = LocalDate.parse(date);

        TherapistAvailability availability =
                availabilityRepository
                        .findByTherapistIdAndDate(therapistId, d)
                        .orElse(null);

        if (availability == null) {
            return ResponseEntity.ok(null);
        }

        return ResponseEntity.ok(availability);
    }

    @GetMapping("/appointments/all")
    public ResponseEntity<List<BookAppointments>> getAllAppointments() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    @GetMapping("/therapist")
    public ResponseEntity<List<TherapistResponse>> getAllTherapists() {
        return ResponseEntity.ok(service.getAllTherapists());
    }

    @GetMapping("/therapist/byUser/{userId}")
    public ResponseEntity<?> getTherapistByUser(@PathVariable int userId) {
        Therapist t = service.getTherapistByUserId(userId);
        if (t == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Therapist not found");
        return ResponseEntity.ok(t);
    }

    @PutMapping("/therapist/availability/{therapistId}")
    public ResponseEntity<?> updateAvailability(
            @PathVariable int therapistId,
            @RequestBody AvailabilityRequest request) {
        Therapist updated = service.updateAvailability(
                therapistId,
                Time.valueOf(request.getAvailableFrom() + ":00"),
                Time.valueOf(request.getAvailableTo()   + ":00")
        );
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Therapist not found");
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/appointments/therapist/{therapistId}")
    public ResponseEntity<List<BookAppointments>> getTherapistAppointments(@PathVariable int therapistId) {
        return ResponseEntity.ok(service.getAppointmentsByTherapist(therapistId));
    }

    @GetMapping("/therapist/{therapistId}")
    public ResponseEntity<?> getTherapistById(@PathVariable int therapistId) {
        Therapist t = therapistRepository.findById(therapistId).orElse(null);
        if (t == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
        return ResponseEntity.ok(t);
    }
}