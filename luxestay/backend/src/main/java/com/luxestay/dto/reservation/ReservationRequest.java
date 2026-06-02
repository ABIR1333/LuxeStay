package com.luxestay.dto.reservation;

import com.luxestay.entity.Reservation;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservationRequest {
    @NotNull  private Long clientId;
    @NotNull  private Long roomId;
    @NotNull  private LocalDate checkInDate;
    @NotNull  private LocalDate checkOutDate;
    @Min(1)   private Integer adults = 1;
    @Min(0)   private Integer children = 0;
    private String specialRequests;
    private Reservation.PaymentStatus paymentStatus = Reservation.PaymentStatus.UNPAID;
}
