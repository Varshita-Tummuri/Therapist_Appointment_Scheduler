package com.example.Backend_AppointmentScheduler.controller;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

public class BookRequest {
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int userId;
    private int therapistId;

    public BookRequest(){}

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public int getUserId() {return userId;}
    public void setUserId(int userId) {this.userId = userId;}

    public int getTherapistId() {return therapistId;}
    public void setTherapistId(int therapistId) {this.therapistId = therapistId;}
}
