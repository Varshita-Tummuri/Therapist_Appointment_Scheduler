package com.example.Backend_AppointmentScheduler.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

// BookAppointments.java — rename ALL fields and fix getters/setters

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"therapistId", "appointmentDate", "startTime"}
        )
)
public class BookAppointments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appointmentId;

    private int userId;
    private int therapistId;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;

    public BookAppointments() {}

    public BookAppointments(LocalDate appointmentDate, LocalTime startTime, LocalTime endTime,
                            int userId, int therapistId, String status) {
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userId = userId;
        this.therapistId = therapistId;
        this.status = status;
    }

    public int getAppointmentId() { return appointmentId; }
    public void setAppointmentId(int appointmentId) { this.appointmentId = appointmentId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }          // was: getAvailable()
    public void setStatus(String status) { this.status = status; }  // was: setAvailable()

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getTherapistId() { return therapistId; }
    public void setTherapistId(int therapistId) { this.therapistId = therapistId; }
}

//@Entity
//public class BookAppointments {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int AppointmentId;
//    private int userId;
//    private int TherapistId;
//    private Date AppointmentDate;
//    private Time StartTime;
//    private Time EndTime;
//    private String Status;
//
//    public BookAppointments(){}
//
//    public BookAppointments(int AppointmentId, Date AppointmentDate, Time StartTime, Time EndTime, String Status, int userId, int TherapistId){
//        this.AppointmentId=AppointmentId;
//        this.AppointmentDate=AppointmentDate;
//        this.StartTime=StartTime;
//        this.EndTime=EndTime;
//        this.Status=Status;
//        this.userId=userId;
//        this.TherapistId=TherapistId;
//    }
//
//    public BookAppointments(Date bookingDate, Time startTime, Time endTime, int userId, int therapistId, String status) {
//        this.AppointmentDate = bookingDate;
//        this.StartTime = startTime;
//        this.EndTime = endTime;
//        this.userId = userId;
//        this.TherapistId = therapistId;
//        this.Status = status;
//    }
//
//    public int getAppointmentId() {return AppointmentId;}
//    public void setAppointmentId(int appointmentId) {AppointmentId = appointmentId;}
//
//    public Date getAppointmentDate() {return AppointmentDate;}
//    public void setAppointmentDate(Date appointmentDate) {AppointmentDate = appointmentDate;}
//
//    public Time getStartTime() { return StartTime; }
//    public void setStartTime(Time startTime) { StartTime = startTime; }
//
//    public Time getEndTime() { return EndTime; }
//    public void setEndTime(Time endTime) { EndTime = endTime; }
//
//    public String getAvailable() {return Status;}
//    public void setAvailable(String Status) {this.Status = Status;}
//
//    public int getUserId() {return userId;}
//    public void setUserId(int userId) {this.userId = userId;}
//
//    public int getTherapistId() {return TherapistId;}
//    public void setTherapistId(int therapistId) {TherapistId = therapistId;}
//}
