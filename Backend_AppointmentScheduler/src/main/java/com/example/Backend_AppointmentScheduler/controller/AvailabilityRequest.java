package com.example.Backend_AppointmentScheduler.controller;

public class AvailabilityRequest {
    private String availableFrom;
    private String availableTo;

    public AvailabilityRequest() {}

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }

    public String getAvailableTo() { return availableTo; }
    public void setAvailableTo(String availableTo) { this.availableTo = availableTo; }
}
