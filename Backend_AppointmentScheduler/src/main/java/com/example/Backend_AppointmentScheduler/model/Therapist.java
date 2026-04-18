package com.example.Backend_AppointmentScheduler.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.sql.Time;
import java.time.LocalTime;

@Entity
public class Therapist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int therapistId;       // ← lowercase first letter
    private int userId;
    private LocalTime availableFrom;    // ← lowercase first letter
    private LocalTime availableTo;      // ← lowercase first letter

    public Therapist() {}

    public Therapist(int therapistId, int userId, LocalTime availableFrom, LocalTime availableTo) {
        this.therapistId = therapistId;
        this.userId = userId;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
    }

    public int getTherapistId() { return therapistId; }
    public void setTherapistId(int therapistId) { this.therapistId = therapistId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public LocalTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }

    public LocalTime getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
}