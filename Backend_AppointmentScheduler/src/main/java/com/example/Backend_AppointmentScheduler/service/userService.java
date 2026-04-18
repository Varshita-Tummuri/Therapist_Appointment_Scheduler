package com.example.Backend_AppointmentScheduler.service;
import com.example.Backend_AppointmentScheduler.controller.BookResponse;
import com.example.Backend_AppointmentScheduler.controller.TherapistAvailability;
import com.example.Backend_AppointmentScheduler.controller.TherapistResponse;
import com.example.Backend_AppointmentScheduler.model.BookAppointments;
import com.example.Backend_AppointmentScheduler.model.Therapist;
import com.example.Backend_AppointmentScheduler.model.User;
import com.example.Backend_AppointmentScheduler.repositories.AppointmentRepository;
import com.example.Backend_AppointmentScheduler.repositories.TherapistAvailabilityRepository;
import com.example.Backend_AppointmentScheduler.repositories.TherapistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.Backend_AppointmentScheduler.repositories.userRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class userService {

    @Autowired
    userRepository repository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private TherapistRepository therapistRepository;
    @Autowired
    private TherapistAvailabilityRepository availabilityRepository;


//    List<User> users =new ArrayList<>(Arrays.asList(
//            new User(101, "user@gmail.com", "u123", "User"),
//            new User(102, "admin@gmail.com", "a123", "Admin"))
//    );
    public User login(String email, String password){
        Optional<User> userOpt = repository.findByEmail(email);
        System.out.println("--------------");
        if(userOpt.isPresent() && userOpt.get().getPassword().equals(password)){
            return userOpt.get();
        }
        return null;
    }

    public User register(String name, String email, String password,
                         String role, Time availableFrom, Time availableTo) {

        // Check if email already exists
        if (repository.findByEmail(email).isPresent()) return null;

        User user = new User(name, email, password, role);
        User saved = repository.save(user);

        // If registering as therapist, create therapist profile too
        if ("Therapist".equalsIgnoreCase(role) && availableFrom != null && availableTo != null) {
            Therapist therapist = new Therapist();
            therapist.setUserId(saved.getId());
            therapist.setAvailableFrom(availableFrom.toLocalTime());
            therapist.setAvailableTo(availableTo.toLocalTime());
            therapistRepository.save(therapist);
        }

        return saved;
    }

    @Transactional
    public BookAppointments bookAppointment(LocalDate bookingDate, LocalTime startTime, LocalTime endTime, int userId, int therapistId) {
        Therapist therapist = therapistRepository.findById(therapistId).orElse(null);
        if (therapist == null) return null;

        // 1. Validate time order
        if (!startTime.isBefore(endTime)) return null;
        // 2. Enforce 30-min slot
        if (startTime.plusMinutes(30).equals(endTime) == false) return null;
        // 3. Check within therapist availability
        if (startTime.isBefore(therapist.getAvailableFrom()) ||
                endTime.isAfter(therapist.getAvailableTo())) {
            return null;
        }
        // 4. Get existing appointments
        List<BookAppointments> existing =
                appointmentRepository.findByTherapistIdAndAppointmentDate(therapistId, bookingDate);
        // 5. Overlap check (ignore CANCELLED)
        for (BookAppointments appt : existing) {
            if (!appt.getStatus().equals("CANCELLED")) {

                boolean overlap =
                        startTime.isBefore(appt.getEndTime()) &&
                                endTime.isAfter(appt.getStartTime());

                if (overlap) return null;
            }
        }
        // 6. Save appointment
        BookAppointments appointment = new BookAppointments(
                bookingDate, startTime, endTime, userId, therapistId, "BOOKED"
        );
        return appointmentRepository.save(appointment);
    }

    public String cancelAppointment(int appointmentId) {
        Optional<BookAppointments> apptOpt = appointmentRepository.findById(appointmentId);
        if (apptOpt.isEmpty()) return "NOT_FOUND";
        BookAppointments appt = apptOpt.get();
        if (appt.getStatus().equals("CANCELLED")) return "ALREADY_CANCELLED";
        appt.setStatus("CANCELLED");
        appointmentRepository.save(appt);
        return "OK";
    }

    public List<BookAppointments> getAppointmentsByUser(int userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public List<BookAppointments> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public TherapistAvailability setAvailability(int therapistId, LocalDate date, LocalTime from, LocalTime to) {
        Optional<TherapistAvailability> existing =
                availabilityRepository.findByTherapistIdAndDate(therapistId, date);

        TherapistAvailability availability;

        if (existing.isPresent()) {
            availability = existing.get();
            availability.setAvailableFrom(from);
            availability.setAvailableTo(to);
        } else {
            availability = new TherapistAvailability(therapistId, date, from, to);
        }

        return availabilityRepository.save(availability);
    }

    public List<TherapistResponse> getAllTherapists() {
        List<Therapist> therapists = therapistRepository.findAll();

        return therapists.stream().map(t -> {
            User user = repository.findById(t.getUserId()).orElse(null);

            return new TherapistResponse(
                    t.getTherapistId(),
                    t.getUserId(),
                    user != null ? user.getName() : "Unknown",
                    t.getAvailableFrom().toString(),
                    t.getAvailableTo().toString()
            );
        }).toList();
    }

    public Therapist getTherapistByUserId(int userId) {
        return therapistRepository.findByUserId(userId).orElse(null);
    }

    public Therapist updateAvailability(int therapistId, Time availableFrom, Time availableTo) {
        Therapist therapist = therapistRepository.findById(therapistId).orElse(null);
        if (therapist == null) return null;
        therapist.setAvailableFrom(availableFrom.toLocalTime());
        therapist.setAvailableTo(availableTo.toLocalTime());
        return therapistRepository.save(therapist);
    }

    public List<BookAppointments> getAppointmentsByTherapist(int therapistId) {
        return appointmentRepository.findByTherapistId(therapistId);
    }
}
