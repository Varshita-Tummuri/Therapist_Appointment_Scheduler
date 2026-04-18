package com.example.Backend_AppointmentScheduler.controller;

public class LoginResponse {
    private boolean success;
    private String message;
    private String role;
    private int userId;
    private String name;   // ← ADD

    public LoginResponse(boolean success, String message, String role, int userId) {
        this.success = success;
        this.message = message;
        this.role    = role;
        this.userId  = userId;
    }

    // add getter/setter for name
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // existing getters...
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getRole()    { return role; }
    public int getUserId()     { return userId; }
}