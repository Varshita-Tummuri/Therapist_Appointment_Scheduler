package com.example.Backend_AppointmentScheduler.controller;

import java.sql.Time;
import java.util.Date;

public class BookResponse {
    private Date BookingDate;
    private Time StartTime;
    private Time EndTime;
    private int userId;
    private int TherapistId;
    private boolean Status;


    public BookResponse(Date BookingDate, Time StartTime, Time EndTime, int userId, int TherapistId, boolean Status) {
        this.BookingDate=BookingDate;
        this.StartTime=StartTime;
        this.EndTime=EndTime;
        this.userId=userId;
        this.TherapistId=TherapistId;
        this.Status=Status;
    }

    public Date getBookingDate() {return BookingDate;}
    public void setAppointmentDate(Date bookingDate) {BookingDate = bookingDate;}

    public Time getStartTime() {return StartTime;}
    public void setStartTime(Time startTime) {StartTime = startTime;}

    public Time getEndTime() {return EndTime;}
    public void setEndTime(Time endTime) {EndTime = endTime;}

    public int getUserId() {return userId;}
    public void setUserId(int userId) {this.userId = userId;}

    public int getTherapistId() {return TherapistId;}
    public void setTherapistId(int therapistId) {TherapistId = therapistId;}

    public boolean isStatus() {return Status;}
    public void setStatus(boolean status) {Status = status;}
}
