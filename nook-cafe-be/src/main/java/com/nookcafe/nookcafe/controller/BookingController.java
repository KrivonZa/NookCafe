package com.nookcafe.nookcafe.controller;

import com.nookcafe.nookcafe.dto.BookingResponse;
import com.nookcafe.nookcafe.dto.CreateBookingRequest;
import com.nookcafe.nookcafe.dto.ErrorResponse;
import com.nookcafe.nookcafe.exception.BadRequestException;
import com.nookcafe.nookcafe.exception.ResourceNotFoundException;
import com.nookcafe.nookcafe.model.BookingStatus;
import com.nookcafe.nookcafe.model.Staff;
import com.nookcafe.nookcafe.repository.StaffRepository;
import com.nookcafe.nookcafe.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final StaffRepository staffRepository;

    public BookingController(BookingService bookingService, StaffRepository staffRepository) {
        this.bookingService = bookingService;
        this.staffRepository = staffRepository;
    }

    @Operation(
        summary = "Create a new booking request",
        description = "Public endpoint to submit a booking. Validates operating hours, duration rules, 15-minute intervals, same-day lead time, capacity limits, and conflicts before creating a PENDING booking.",
        tags = {"Bookings"}
    )
    @ApiResponse(responseCode = "201", description = "Booking created successfully and is now PENDING review")
    @ApiResponse(responseCode = "400", description = "Business rule or input validation failed", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Requested room not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        BookingResponse booking = bookingService.createBooking(request);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @Operation(
        summary = "List bookings with filters",
        description = "Staff-only endpoint to list all bookings. Optional filters for status, phone number, or date of the meeting.",
        tags = {"Staff - Bookings"}
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings list")
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(bookingService.getBookings(status, phone, date));
    }

    @Operation(
        summary = "Get booking details by ID",
        description = "Staff-only endpoint to retrieve a single booking's details.",
        tags = {"Staff - Bookings"}
    )
    @ApiResponse(responseCode = "200", description = "Booking details retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Booking not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @Operation(
        summary = "Confirm a pending booking",
        description = "Staff-only endpoint to approve a PENDING booking request. Changes status to CONFIRMED and binds the handler staff ID.",
        tags = {"Staff - Bookings"}
    )
    @ApiResponse(responseCode = "200", description = "Booking confirmed successfully")
    @ApiResponse(responseCode = "400", description = "Booking is not PENDING", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Booking or Staff member not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping("/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(@PathVariable Long id, Authentication auth) {
        Long staffId = getAuthenticatedStaffId(auth);
        return ResponseEntity.ok(bookingService.confirmBooking(id, staffId));
    }

    @Operation(
        summary = "Cancel a booking",
        description = "Staff-only endpoint to reject/cancel a booking. Changes status to CANCELLED.",
        tags = {"Staff - Bookings"}
    )
    @ApiResponse(responseCode = "200", description = "Booking cancelled successfully")
    @ApiResponse(responseCode = "400", description = "Booking already in a terminal state (CANCELLED/EXPIRED)", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Booking or Staff member not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id, Authentication auth) {
        Long staffId = getAuthenticatedStaffId(auth);
        return ResponseEntity.ok(bookingService.cancelBooking(id, staffId));
    }

    @Operation(
        summary = "Reschedule an existing booking",
        description = "Staff-only endpoint to reschedule a booking's date/time. Re-validates all operating hours, duration, lead time, and room schedule conflicts (excluding the booking itself). Automatically CONFIRMS the booking.",
        tags = {"Staff - Bookings"}
    )
    @ApiResponse(responseCode = "200", description = "Booking rescheduled and updated successfully")
    @ApiResponse(responseCode = "400", description = "Rescheduling validation failed or invalid body format", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Booking or Staff member not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping("/{id}/reschedule")
    public ResponseEntity<BookingResponse> rescheduleBooking(
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "New start and end time schedules",
                required = true,
                content = @Content(schema = @Schema(example = "{\"startTime\": \"2026-07-20T16:00:00\", \"endTime\": \"2026-07-20T17:30:00\"}"))
            )
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long staffId = getAuthenticatedStaffId(auth);
        
        if (!body.containsKey("startTime") || !body.containsKey("endTime")) {
            throw new BadRequestException("Reschedule body must contain startTime and endTime in ISO format.");
        }
        
        LocalDateTime startTime = LocalDateTime.parse(body.get("startTime"));
        LocalDateTime endTime = LocalDateTime.parse(body.get("endTime"));
        
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, startTime, endTime, staffId));
    }

    private Long getAuthenticatedStaffId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new BadRequestException("Authentication is required to perform this action.");
        }
        String email = auth.getName();
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff record not found for email: " + email));
        return staff.getId();
    }
}
