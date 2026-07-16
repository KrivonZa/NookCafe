package com.nookcafe.nookcafe.service;

import com.nookcafe.nookcafe.dto.BookingResponse;
import com.nookcafe.nookcafe.dto.CreateBookingRequest;
import com.nookcafe.nookcafe.exception.BadRequestException;
import com.nookcafe.nookcafe.exception.ResourceNotFoundException;
import com.nookcafe.nookcafe.model.*;
import com.nookcafe.nookcafe.repository.BookingRepository;
import com.nookcafe.nookcafe.repository.StaffRepository;
import com.nookcafe.nookcafe.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkspaceRepository workspaceRepository;
    private final StaffRepository staffRepository;

    public BookingService(BookingRepository bookingRepository,
                          WorkspaceRepository workspaceRepository,
                          StaffRepository staffRepository) {
        this.bookingRepository = bookingRepository;
        this.workspaceRepository = workspaceRepository;
        this.staffRepository = staffRepository;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + request.getWorkspaceId()));

        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();

        // 1. Room Availability Rule
        if (workspace.getStatus() != WorkspaceStatus.AVAILABLE) {
            throw new BadRequestException("Workspace is not available for booking. Current status: " + workspace.getStatus());
        }

        // 2. Capacity Rule
        if (request.getNumberOfGuests() > workspace.getCapacityMax()) {
            throw new BadRequestException("Number of guests (" + request.getNumberOfGuests() + 
                    ") exceeds workspace maximum capacity (" + workspace.getCapacityMax() + ").");
        }

        // 3. Operating Hours & Time Rules
        validateOperatingHours(startTime, endTime);
        validateTimeRules(startTime, endTime);

        // 4. Same-Day Bookings Lead Time & Past Date Check
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        if (startTime.toLocalDate().isBefore(now.toLocalDate())) {
            throw new BadRequestException("Cannot book a past date.");
        }
        if (startTime.toLocalDate().equals(now.toLocalDate())) {
            LocalDateTime earliest = getEarliestStartTime(now);
            if (startTime.isBefore(earliest)) {
                throw new BadRequestException("Same-day bookings must start at least 30 minutes from now (rounded to the next 15-minute step). Earliest bookable time is " + earliest.toLocalTime());
            }
        }

        // 5. Overlap Check (including 15-minute buffer)
        LocalDateTime adjustedStart = startTime.minusMinutes(15);
        LocalDateTime adjustedEnd = endTime.plusMinutes(15);
        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                workspace.getId(), adjustedStart, adjustedEnd, null
        );
        if (hasOverlap) {
            throw new BadRequestException("The requested time slot conflicts with an existing booking (including 15-minute room turnover buffers).");
        }

        // 6. Pricing Calculation
        long minutes = Duration.between(startTime, endTime).toMinutes();
        double hours = minutes / 60.0;
        BigDecimal totalPrice = workspace.getPricePerHour().multiply(BigDecimal.valueOf(hours));

        Booking booking = new Booking();
        booking.setWorkspace(workspace);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setFullName(request.getFullName());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setEmail(request.getEmail());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalPrice(totalPrice.setScale(0, java.math.RoundingMode.HALF_UP));

        // 7. Dynamic PENDING Expiration
        LocalDateTime expiresAt = now.plusHours(4);
        LocalDateTime startMinus15 = startTime.minusMinutes(15);
        if (startMinus15.isBefore(expiresAt)) {
            expiresAt = startMinus15;
        }
        booking.setExpiresAt(expiresAt);

        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirmBooking(Long id, Long staffId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be confirmed. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setHandledByStaff(staff);
        booking.setExpiresAt(null); // Clear expiration since it's now confirmed

        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, Long staffId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.EXPIRED) {
            throw new BadRequestException("Booking is already in a terminal state: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setHandledByStaff(staff);
        booking.setExpiresAt(null);

        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse rescheduleBooking(Long id, LocalDateTime newStartTime, LocalDateTime newEndTime, Long staffId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        // Validations:
        validateOperatingHours(newStartTime, newEndTime);
        validateTimeRules(newStartTime, newEndTime);

        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        if (newStartTime.toLocalDate().isBefore(now.toLocalDate())) {
            throw new BadRequestException("Cannot reschedule to a past date.");
        }
        if (newStartTime.toLocalDate().equals(now.toLocalDate())) {
            LocalDateTime earliest = getEarliestStartTime(now);
            if (newStartTime.isBefore(earliest)) {
                throw new BadRequestException("Same-day rescheduled bookings must start at least 30 minutes from now (rounded). Earliest is " + earliest.toLocalTime());
            }
        }

        // Check overlap excluding this booking itself
        LocalDateTime adjustedStart = newStartTime.minusMinutes(15);
        LocalDateTime adjustedEnd = newEndTime.plusMinutes(15);
        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                booking.getWorkspace().getId(), adjustedStart, adjustedEnd, booking.getId()
        );
        if (hasOverlap) {
            throw new BadRequestException("The requested rescheduled time slot conflicts with an existing booking.");
        }

        booking.setStartTime(newStartTime);
        booking.setEndTime(newEndTime);

        // Recalculate price
        long minutes = Duration.between(newStartTime, newEndTime).toMinutes();
        double hours = minutes / 60.0;
        BigDecimal totalPrice = booking.getWorkspace().getPricePerHour().multiply(BigDecimal.valueOf(hours));
        booking.setTotalPrice(totalPrice.setScale(0, java.math.RoundingMode.HALF_UP));

        // Recalculate expiration if booking is still PENDING
        if (booking.getStatus() == BookingStatus.PENDING) {
            LocalDateTime expiresAt = now.plusHours(4);
            LocalDateTime startMinus15 = newStartTime.minusMinutes(15);
            if (startMinus15.isBefore(expiresAt)) {
                expiresAt = startMinus15;
            }
            booking.setExpiresAt(expiresAt);
        } else {
            booking.setStatus(BookingStatus.CONFIRMED); // Rescheduling a confirmed booking keeps/updates it to confirmed
            booking.setExpiresAt(null);
        }

        booking.setHandledByStaff(staff);

        return new BookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookings(BookingStatus status, String phoneNumber, LocalDate date) {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> phoneNumber == null || b.getPhoneNumber().contains(phoneNumber))
                .filter(b -> date == null || b.getStartTime().toLocalDate().equals(date))
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return new BookingResponse(booking);
    }

    @Transactional
    public int expireOverdueBookings() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        return bookingRepository.expirePendingBookings(now);
    }

    // Helper: operating hours validations
    private void validateOperatingHours(LocalDateTime startTime, LocalDateTime endTime) {
        if (!startTime.toLocalDate().equals(endTime.toLocalDate())) {
            throw new BadRequestException("Bookings must start and end on the same day.");
        }
        DayOfWeek dayOfWeek = startTime.getDayOfWeek();
        LocalTime open, close;
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            open = LocalTime.of(8, 0);
            close = LocalTime.of(23, 0);
        } else {
            open = LocalTime.of(7, 0);
            close = LocalTime.of(22, 0);
        }
        LocalTime startLocalTime = startTime.toLocalTime();
        LocalTime endLocalTime = endTime.toLocalTime();
        if (startLocalTime.isBefore(open) || endLocalTime.isAfter(close)) {
            throw new BadRequestException("Booking must be entirely within operating hours: " +
                    (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY ? "08:00 - 23:00" : "07:00 - 22:00"));
        }
    }

    // Helper: duration and time step validation
    private void validateTimeRules(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime.getSecond() != 0 || startTime.getNano() != 0 ||
            endTime.getSecond() != 0 || endTime.getNano() != 0 ||
            startTime.getMinute() % 15 != 0 || endTime.getMinute() % 15 != 0) {
            throw new BadRequestException("Booking start and end times must be in 15-minute increments.");
        }
        long minutes = Duration.between(startTime, endTime).toMinutes();
        if (minutes < 60) {
            throw new BadRequestException("Minimum booking duration is 1 hour.");
        }
        if (minutes > 240) {
            throw new BadRequestException("Maximum booking duration is 4 hours.");
        }
    }

    // Helper: calculate same-day earliest allowed start time
    private LocalDateTime getEarliestStartTime(LocalDateTime now) {
        LocalDateTime thirtyMinsLater = now.plusMinutes(30);
        int minute = thirtyMinsLater.getMinute();
        int remainder = minute % 15;
        if (remainder == 0) {
            return thirtyMinsLater.withSecond(0).withNano(0);
        } else {
            return thirtyMinsLater.plusMinutes(15 - remainder).withSecond(0).withNano(0);
        }
    }
}
