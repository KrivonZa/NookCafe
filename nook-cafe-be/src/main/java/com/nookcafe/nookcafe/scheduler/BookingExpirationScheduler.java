package com.nookcafe.nookcafe.scheduler;

import com.nookcafe.nookcafe.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(BookingExpirationScheduler.class);
    private final BookingService bookingService;

    public BookingExpirationScheduler(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Run every 1 minute
    @Scheduled(fixedDelay = 60000)
    public void checkPendingExpirations() {
        log.info("Running scheduled check for expired PENDING bookings...");
        int expiredCount = bookingService.expireOverdueBookings();
        if (expiredCount > 0) {
            log.info("Successfully expired {} pending bookings.", expiredCount);
        }
    }
}
