-- ================================================
-- Appointment Scheduler - Seed Data (H2 Compatible)
-- ================================================

-- ------------------------------------------------
-- 1. Clear existing data (safe order due to FKs)
-- ------------------------------------------------
SET REFERENTIAL_INTEGRITY FALSE;
TRUNCATE TABLE book_appointments;
TRUNCATE TABLE therapist;
TRUNCATE TABLE users;
SET REFERENTIAL_INTEGRITY TRUE;

-- ------------------------------------------------
-- 2. Users (1 Admin, 3 Therapists, 3 Regular Users)
-- ------------------------------------------------
INSERT INTO users (id, email, password, role) VALUES
(1, 'admin@clinic.com',    'admin123', 'Admin'),
(2, 'dr.priya@clinic.com', 'priya123', 'Therapist'),
(3, 'dr.rahul@clinic.com', 'rahul123', 'Therapist'),
(4, 'dr.sneha@clinic.com', 'sneha123', 'Therapist'),
(5, 'user1@gmail.com',     'user123',  'User'),
(6, 'user2@gmail.com',     'user123',  'User'),
(7, 'user3@gmail.com',     'user123',  'User');

-- ------------------------------------------------
-- 3. Therapist profiles (linked to user accounts)
-- ------------------------------------------------
INSERT INTO therapist (therapist_id, user_id, available_from, available_to) VALUES
(1, 2, '09:00:00', '17:00:00'),
(2, 3, '10:00:00', '18:00:00'),
(3, 4, '08:00:00', '14:00:00');

-- ------------------------------------------------
-- 4. Sample appointments (mix of statuses)
-- ------------------------------------------------
INSERT INTO book_appointments
  (appointment_id, user_id, therapist_id, appointment_date, start_time, end_time, status)
VALUES
(1, 5, 1, '2026-04-15', '09:00:00', '09:30:00', 'PENDING'),
(2, 5, 1, '2026-04-16', '10:00:00', '10:30:00', 'CONFIRMED'),
(3, 5, 2, '2026-04-10', '11:00:00', '11:30:00', 'CANCELLED'),
(4, 6, 2, '2026-04-17', '14:00:00', '14:30:00', 'PENDING'),
(5, 6, 3, '2026-04-18', '08:00:00', '08:30:00', 'CONFIRMED'),
(6, 7, 1, '2026-04-20', '15:00:00', '15:30:00', 'PENDING'),
(7, 7, 3, '2026-04-14', '09:00:00', '09:30:00', 'CONFIRMED');