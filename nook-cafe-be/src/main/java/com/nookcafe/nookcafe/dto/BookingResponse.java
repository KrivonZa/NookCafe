package com.nookcafe.nookcafe.dto;

import com.nookcafe.nookcafe.model.Booking;
import com.nookcafe.nookcafe.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private WorkspaceResponse workspace;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime expiresAt;
    private Short numberOfGuests;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String notes;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private StaffResponse handledByStaff;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingResponse() {}

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        if (booking.getWorkspace() != null) {
            this.workspace = new WorkspaceResponse(booking.getWorkspace());
        }
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.expiresAt = booking.getExpiresAt();
        this.numberOfGuests = booking.getNumberOfGuests();
        this.fullName = booking.getFullName();
        this.phoneNumber = booking.getPhoneNumber();
        this.email = booking.getEmail();
        this.notes = booking.getNotes();
        this.status = booking.getStatus();
        this.totalPrice = booking.getTotalPrice();
        if (booking.getHandledByStaff() != null) {
            this.handledByStaff = new StaffResponse(booking.getHandledByStaff());
        }
        this.createdAt = booking.getCreatedAt();
        this.updatedAt = booking.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WorkspaceResponse getWorkspace() { return workspace; }
    public void setWorkspace(WorkspaceResponse workspace) { this.workspace = workspace; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Short getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(Short numberOfGuests) { this.numberOfGuests = numberOfGuests; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public StaffResponse getHandledByStaff() { return handledByStaff; }
    public void setHandledByStaff(StaffResponse handledByStaff) { this.handledByStaff = handledByStaff; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
