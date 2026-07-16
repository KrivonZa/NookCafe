package com.nookcafe.nookcafe.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CreateBookingRequest {

    @NotNull(message = "Workspace ID is required")
    @Schema(example = "1", description = "ID of the workspace/room to book")
    private Long workspaceId;

    @NotNull(message = "Start time is required")
    @Schema(example = "2026-07-20T14:00:00", description = "Start time, 15-minute increments only")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Schema(example = "2026-07-20T15:00:00", description = "End time, must be at least 1 hour and at most 4 hours after startTime")
    private LocalDateTime endTime;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    @Schema(example = "6", description = "Number of guests for the booking")
    private Short numberOfGuests;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    @Schema(example = "Nguyen Van A", description = "Full name of the guest")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Invalid Vietnamese phone number. Must be 10 digits starting with 03, 05, 07, 08, or 09.")
    @Schema(example = "0912345678", description = "Vietnamese phone number of the guest")
    private String phoneNumber;

    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    @Schema(example = "nguyenvana@email.com", description = "Optional email address of the guest")
    private String email;

    @Size(max = 300, message = "Special notes must not exceed 300 characters")
    @Schema(example = "Need a projector screen", description = "Optional special requests or notes")
    private String notes;

    public CreateBookingRequest() {}

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Short getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Short numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
