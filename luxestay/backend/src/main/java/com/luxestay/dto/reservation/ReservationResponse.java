package com.luxestay.dto.reservation;

import com.luxestay.entity.Reservation;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {
    private Long id;
    private String reservationNo;
    private Long clientId;
    private String clientFullName;
    private String clientEmail;
    private String clientPhone;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private BigDecimal totalPrice;
    private Reservation.ReservationStatus status;
    private String specialRequests;
    private Reservation.PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private long nights;
}
