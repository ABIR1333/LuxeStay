package com.luxestay.service;

import com.luxestay.dto.reservation.*;
import com.luxestay.entity.Reservation;
import java.util.List;

public interface ReservationService {
    List<ReservationResponse> getAllReservations();
    ReservationResponse getById(Long id);
    ReservationResponse create(ReservationRequest request);
    ReservationResponse update(Long id, ReservationRequest request);
    ReservationResponse updateStatus(Long id, Reservation.ReservationStatus status);
    void cancel(Long id);
    ReservationResponse checkIn(Long id);
    ReservationResponse checkOut(Long id);
    List<ReservationResponse> getByClientId(Long clientId);
}
