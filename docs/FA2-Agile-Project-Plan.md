FA2 — Agile Project Plan
I. Project Title
Therapist Appointment Scheduler
2. Project Overview
The Therapist Appointment Scheduler is a web-based application that allows patients to book
appointments with therapists according to their availability. Therapists can configure their
available hours, view booked appointments, and track cancellations. Administrators can view,
edit, and delete appointments.
The application has three roles: Patient/user, Therapist, and Admin.
3. Project Objective
The objective is to provide a convenient and organized appointment scheduling system while
demonstrating Agile project planning in Jira and an automated CI/CD pipeline using GitHub
Actions.
4. Team and Roles
Member
[Student 1
Name]
[Student 2
Name]
Scrum Role
Responsibility
Product Owner I Scrum dira backlog, user stories, sprint planning, Agile
Master
Developer 1 CI/CD
Engineer
documentation
GitHub repository, automated tests, GitHub Actions
pipeline, deployment
Both members review each other's work and contribute to the application and the
demonstration video.
5. Tools Used
Purpose
Agile planning (backlog, sprints, board) Jira (Scrum project, key: TAS)
Source control
CI/CD automation
Automated testing
Code quality check
Deployment
GitHub
GitHub Actions
Jest
ESLint
Render
Commit messages include the Jira issue key (for example TAS-2: add slot generator ) so that
code changes can be traced back to user stories.
6. User Stories
The stories are maintained in the Jira backlog (project key TAS). Story points are relative
effort estimates.
US-OI (TAS-I): Manage Therapist Availability
As a therapist, I want to set my available hours for specific dates so that patients can book
sessions only when I am available.
Priority: High Story Points: 5
US-02 (TAS-2): View Available Slots
As a patient, I want to select a therapist and a date and view the available 30-minute time slots
so that I can pick a suitable appointment time.
Priority: High Story Points: 8
US-03 (TAS-3): Book and View Appointments
As a patient, I want to book a slot and see it under Your Appointments so that I can track my
sessions.
Priority: High Story Points: 5
US-04 (TAS-4): Cancel an Appointment
As a patient, I want to cancel an appointment so that I can free the slot when my plans change.
Priority: Medium Story Points: 3
US-05 (TAS-5): Manage Appointments as Admin
As an administrator, I want to view, edit, and delete appointments so that I can oversee the
appointment scheduling system.
Priority: Medium Story Points: 5
Total estimated effort: 26 story points.
7. Acceptance Criteria
US-02: View Available Slots
1. The patient can select a therapist and a date.
2. If the therapist has configured availability for that date (for example 10:00 to 13:00), the
application displays the available 30-minute slots (10:00, 10:30, 11:00, 11:30, 12:00, 12:30).
3. A slot that is already booked is not displayed as available.
4. If the therapist has not configured availability for that date, the application displays the
message "Therapist is unavailable on this date".
5. Slots are displayed in chronological order.
US-04: Cancel an Appointment
1. The patient can cancel an existing booked appointment.
2. The cancelled appointment is removed from Your Appointments and is displayed under
Cancelled Appointments for both the patient and the therapist
3. The cancelled slot becomes available for booking again.
These criteria must be verified against the actual application before the stories are marked
complete.
8. Sprint Planning
Sprints are planned and tracked on the Jira Scrum board (To Do, In Progress, Done).
Sprint 1: Core Booking Flow
Sprint Goal: A patient can view the available slots of a therapist and book an appointment.
Dates: [start date] to [end date]
Stories included:
• US-OI (TAS-I): Manage Therapist Availability — 5 points
• US-02 (TAS-2): ViewAvailable Slots—8points
• US-03 (TAS-3): Book and View Appointments — 5 points
Sprint commitment: 18 story points.
Planned activities:
• Review the existing application and GitHub repository.
• Finalize user stories and acceptance criteria in Jira.
• Identify the frontend, backend, database, and existing tests.
• Create the basic GitHub Actions workflow (build and test).
Expected outcome: Working availability, slot display, and booking features, and a basic
automated build and test run.
Sprint 2: Cancellation, Admin Features, and Complete CI/CD Pipel ine
Sprint Goal: Complete the remaining features and a full CI/CD pipeline with deployment.
Dates: [start date] to [end date]
Stories included:
• US-04 (TAS-4): Cancel an Appointment — 3 points
• US-05 (TAS-5): Manage Appointments as Admin— 5 points
Sprint commitment: 8 story points plus pipeline work.
Planned activities:
• Complete the cancellation and admin features.
• Add the code quality check (ESLint) to the pipeline.
• Configure deployment after all checks pass.
• Test the pipeline, including one failing run and its fix.
• Prepare demonstration evidence and record the video.
Expected outcome: A verified CI/CD pipeline and a deployed application.
Agile Ceremonies
Sprint Planning at the start Of each sprint.
• Short daily stand-up (what was done, what is planned, any blockers).
Sprint Review: demonstration of the completed stories to each other.
Sprint Retrospective: what went well and what to improve.
9. Definition of Done
A user story is considered complete when:
• The relevant code changes are committed and pushed to GitHub.
• The application builds successfully.
• The applicable automated tests are written and pass
• The code quality (lint) check passes.
The relevant acceptance criteria are verified.
• The CI/CD pipeline run is successful.
• The change is deployed and works on the live application when required.
• The code is reviewed by the teammate.
• The changes and test results are documented.
10. CI/CD Workflow
The pipeline follows these stages:
GitHub Build Automated Testing Code Quality Check Deployment
Stage
GitHub
Build
Description
A push or pull request to the main branch triggers the workflow.
Dependencies are installed and the application is built.
Automated Testing Jest unit and API tests run, and a coverage report is generated
Code Quality
ESLint verifies code standards.
Check
The application is deployed to Render only after all previous stages
Deployment
succeed.
Each stage depends on the previous one, so a failure at any stage stops the pipeline and
prevents deployment
11. Evidence and Links
Item
GitHub repository
GitHub Actions runs
Link I Location
[add link]
[add link]
Live deployed application [add link]
Jira board
Demonstration video
[add link]
Submitted on Google Classroom
12. Expected Outcome
The activity will demonstrate how a software project can use Agile planning in dira and CI/CD
automation with GitHub Actions to validate code changes, identify issues early, and deploy a
verified application.
