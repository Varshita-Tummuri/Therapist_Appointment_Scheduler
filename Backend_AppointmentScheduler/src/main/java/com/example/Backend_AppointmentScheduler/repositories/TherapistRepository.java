package com.example.Backend_AppointmentScheduler.repositories;

import com.example.Backend_AppointmentScheduler.model.Therapist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist, Integer> {
    Optional<Therapist> findByUserId(int userId);

}
