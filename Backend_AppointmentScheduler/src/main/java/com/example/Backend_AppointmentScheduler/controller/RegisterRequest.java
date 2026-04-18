package com.example.Backend_AppointmentScheduler.controller;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;           // "User" or "Therapist"
    private String availableFrom;  // "09:00" — only for Therapist
    private String availableTo;    // "17:00" — only for Therapist

    public String getName()          { return name; }
    public void setName(String n)    { this.name = n; }
    public String getEmail()         { return email; }
    public void setEmail(String e)   { this.email = e; }
    public String getPassword()      { return password; }
    public void setPassword(String p){ this.password = p; }
    public String getRole()          { return role; }
    public void setRole(String r)    { this.role = r; }
    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String a){ this.availableFrom = a; }
    public String getAvailableTo()   { return availableTo; }
    public void setAvailableTo(String a)  { this.availableTo = a; }
}
