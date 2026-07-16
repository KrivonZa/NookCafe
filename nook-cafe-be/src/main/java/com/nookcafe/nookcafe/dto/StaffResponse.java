package com.nookcafe.nookcafe.dto;

import com.nookcafe.nookcafe.model.Staff;

public class StaffResponse {
    private Long id;
    private String fullName;
    private String email;

    public StaffResponse() {}

    public StaffResponse(Staff staff) {
        if (staff != null) {
            this.id = staff.getId();
            this.fullName = staff.getFullName();
            this.email = staff.getEmail();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
