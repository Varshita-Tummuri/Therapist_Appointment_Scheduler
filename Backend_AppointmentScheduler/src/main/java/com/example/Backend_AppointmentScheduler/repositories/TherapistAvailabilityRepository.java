package com.example.Backend_AppointmentScheduler.repositories;

import com.example.Backend_AppointmentScheduler.controller.TherapistAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface TherapistAvailabilityRepository extends JpaRepository<TherapistAvailability, Integer> {

    Optional<TherapistAvailability> findByTherapistIdAndDate(int therapistId, LocalDate date);

}
