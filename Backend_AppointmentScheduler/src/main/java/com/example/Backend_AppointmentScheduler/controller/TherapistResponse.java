package com.example.Backend_AppointmentScheduler.controller;

import java.time.LocalTime;

public class TherapistResponse {
    private int therapistId;
    private int userId;
    private String name;
    private String availableFrom;
    private String availableTo;

    public TherapistResponse(int therapistId, int userId, String name,
                             String availableFrom, String availableTo) {
        this.therapistId = therapistId;
        this.userId = userId;
        this.name = name;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
    }

    // getters
    public int getTherapistId() { return therapistId; }
    public int getUserId() { return userId; }
    public String getName() { return name; }
    public String getAvailableFrom() { return availableFrom; }
    public String getAvailableTo() { return availableTo; }
}