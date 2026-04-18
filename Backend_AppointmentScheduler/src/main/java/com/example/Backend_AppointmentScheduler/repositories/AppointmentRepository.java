package com.example.Backend_AppointmentScheduler.repositories;

import com.example.Backend_AppointmentScheduler.model.BookAppointments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<BookAppointments, Integer> {

    List<BookAppointments> findByTherapistIdAndAppointmentDate(int therapistId, LocalDate appointmentDate);
    List<BookAppointments> findByUserId(int userId);
    List<BookAppointments> findByTherapistId(int therapistId);
    List<BookAppointments> findAll();
}