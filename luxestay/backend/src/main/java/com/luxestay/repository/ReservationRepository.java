package com.luxestay.repository;

import com.luxestay.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByReservationNo(String reservationNo);

    List<Reservation> findByClientId(Long clientId);

    List<Reservation> findByRoomId(Long roomId);

    List<Reservation> findByStatus(Reservation.ReservationStatus status);

    long countByStatus(Reservation.ReservationStatus status);

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.status = 'CHECKED_OUT' AND r.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r WHERE r.status = 'CHECKED_OUT' AND r.paymentStatus = 'PAID' AND MONTH(r.checkOutDate) = :month AND YEAR(r.checkOutDate) = :year")
    BigDecimal getMonthlyRevenue(@Param("month") int month, @Param("year") int year);

    @Query("""
        SELECT COUNT(r) > 0 FROM Reservation r
        WHERE r.room.id = :roomId
        AND r.status NOT IN ('CANCELLED', 'CHECKED_OUT')
        AND r.checkInDate < :checkOut
        AND r.checkOutDate > :checkIn
    """)
    boolean existsOverlappingReservation(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    List<Reservation> findByCheckInDateOrderByCheckInDateAsc(LocalDate date);

    List<Reservation> findByCheckOutDateOrderByCheckOutDateAsc(LocalDate date);

    @Query("SELECT r FROM Reservation r ORDER BY r.createdAt DESC")
    List<Reservation> findAllOrderByCreatedAtDesc();
}
