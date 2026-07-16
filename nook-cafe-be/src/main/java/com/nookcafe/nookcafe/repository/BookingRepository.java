package com.nookcafe.nookcafe.repository;

import com.nookcafe.nookcafe.model.Booking;
import com.nookcafe.nookcafe.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.workspace.id = :workspaceId " +
           "AND (:excludeBookingId IS NULL OR b.id <> :excludeBookingId) " +
           "AND b.status IN (com.nookcafe.nookcafe.model.BookingStatus.PENDING, com.nookcafe.nookcafe.model.BookingStatus.CONFIRMED) " +
           "AND :adjustedStart < b.endTime AND :adjustedEnd > b.startTime")
    boolean existsOverlappingBooking(
        @Param("workspaceId") Long workspaceId,
        @Param("adjustedStart") LocalDateTime adjustedStart,
        @Param("adjustedEnd") LocalDateTime adjustedEnd,
        @Param("excludeBookingId") Long excludeBookingId
    );

    @Modifying
    @Query("UPDATE Booking b SET b.status = com.nookcafe.nookcafe.model.BookingStatus.EXPIRED " +
           "WHERE b.status = com.nookcafe.nookcafe.model.BookingStatus.PENDING AND b.expiresAt < :now")
    int expirePendingBookings(@Param("now") LocalDateTime now);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByPhoneNumber(String phoneNumber);

    @Query("SELECT b FROM Booking b WHERE b.startTime >= :startOfDay AND b.startTime <= :endOfDay")
    List<Booking> findBookingsOnDate(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
}
