package com.example.Backend_AppointmentScheduler.controller;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class TherapistAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int therapistId;
    private LocalDate date;
    private LocalTime availableFrom;
    private LocalTime availableTo;

    public TherapistAvailability() {}

    public TherapistAvailability(int therapistId, LocalDate date,
                                 LocalTime from, LocalTime to) {
        this.therapistId = therapistId;
        this.date = date;
        this.availableFrom = from;
        this.availableTo = to;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setTherapistId(int therapistId) {
        this.therapistId = therapistId;
    }

    public int getTherapistId() {
        return therapistId;
    }

    public void setAvailableTo(LocalTime availableTo) {
        this.availableTo = availableTo;
    }

    public void setAvailableFrom(LocalTime availableFrom) {
        this.availableFrom = availableFrom;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalTime getAvailableFrom() {
        return availableFrom;
    }

    public LocalTime getAvailableTo() {
        return availableTo;
    }
}