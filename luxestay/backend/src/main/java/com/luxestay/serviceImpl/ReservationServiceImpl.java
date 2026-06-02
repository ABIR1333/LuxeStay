package com.luxestay.serviceImpl;

import com.luxestay.dto.reservation.*;
import com.luxestay.entity.*;
import com.luxestay.exception.*;
import com.luxestay.repository.*;
import com.luxestay.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired private ReservationRepository reservationRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private ClientRepository clientRepository;

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllOrderByCreatedAtDesc()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ReservationResponse getById(Long id) {
        return toResponse(findReservation(id));
    }

    @Override
    public ReservationResponse create(ReservationRequest request) {
        validateDates(request.getCheckInDate(), request.getCheckOutDate());

        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + request.getClientId()));

        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomId()));

        if (reservationRepository.existsOverlappingReservation(
            room.getId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new BadRequestException("Room is not available for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Reservation res = Reservation.builder()
            .reservationNo(generateReservationNo())
            .client(client)
            .room(room)
            .checkInDate(request.getCheckInDate())
            .checkOutDate(request.getCheckOutDate())
            .adults(request.getAdults())
            .children(request.getChildren() != null ? request.getChildren() : 0)
            .totalPrice(total)
            .status(Reservation.ReservationStatus.CONFIRMED)
            .specialRequests(request.getSpecialRequests())
            .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : Reservation.PaymentStatus.UNPAID)
            .build();

        room.setStatus(Room.RoomStatus.RESERVED);
        roomRepository.save(room);

        return toResponse(reservationRepository.save(res));
    }

    @Override
    public ReservationResponse update(Long id, ReservationRequest request) {
        Reservation res = findReservation(id);
        validateDates(request.getCheckInDate(), request.getCheckOutDate());

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal total = res.getRoom().getPricePerNight().multiply(BigDecimal.valueOf(nights));

        res.setCheckInDate(request.getCheckInDate());
        res.setCheckOutDate(request.getCheckOutDate());
        res.setAdults(request.getAdults());
        res.setChildren(request.getChildren() != null ? request.getChildren() : 0);
        res.setTotalPrice(total);
        res.setSpecialRequests(request.getSpecialRequests());
        if (request.getPaymentStatus() != null) res.setPaymentStatus(request.getPaymentStatus());

        return toResponse(reservationRepository.save(res));
    }

    @Override
    public ReservationResponse updateStatus(Long id, Reservation.ReservationStatus status) {
        Reservation res = findReservation(id);
        res.setStatus(status);
        return toResponse(reservationRepository.save(res));
    }

    @Override
    public void cancel(Long id) {
        Reservation res = findReservation(id);
        res.setStatus(Reservation.ReservationStatus.CANCELLED);
        res.getRoom().setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(res.getRoom());
        reservationRepository.save(res);
    }

    @Override
    public ReservationResponse checkIn(Long id) {
        Reservation res = findReservation(id);
        res.setStatus(Reservation.ReservationStatus.CHECKED_IN);
        res.getRoom().setStatus(Room.RoomStatus.OCCUPIED);
        roomRepository.save(res.getRoom());
        return toResponse(reservationRepository.save(res));
    }

    @Override
    public ReservationResponse checkOut(Long id) {
        Reservation res = findReservation(id);
        res.setStatus(Reservation.ReservationStatus.CHECKED_OUT);
        res.getRoom().setStatus(Room.RoomStatus.AVAILABLE);
        roomRepository.save(res.getRoom());
        return toResponse(reservationRepository.save(res));
    }

    @Override
    public List<ReservationResponse> getByClientId(Long clientId) {
        return reservationRepository.findByClientId(clientId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Reservation findReservation(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out must be after check-in date");
        }
    }

    private String generateReservationNo() {
        return "RES-" + LocalDate.now().getYear() + "-" +
            String.format("%04d", new Random().nextInt(9999) + 1);
    }

    private ReservationResponse toResponse(Reservation r) {
        ReservationResponse res = new ReservationResponse();
        res.setId(r.getId());
        res.setReservationNo(r.getReservationNo());
        res.setClientId(r.getClient().getId());
        res.setClientFullName(r.getClient().getFirstName() + " " + r.getClient().getLastName());
        res.setClientEmail(r.getClient().getEmail());
        res.setClientPhone(r.getClient().getPhone());
        res.setRoomId(r.getRoom().getId());
        res.setRoomNumber(r.getRoom().getRoomNumber());
        res.setRoomType(r.getRoom().getRoomType().name());
        res.setCheckInDate(r.getCheckInDate());
        res.setCheckOutDate(r.getCheckOutDate());
        res.setAdults(r.getAdults());
        res.setChildren(r.getChildren());
        res.setTotalPrice(r.getTotalPrice());
        res.setStatus(r.getStatus());
        res.setSpecialRequests(r.getSpecialRequests());
        res.setPaymentStatus(r.getPaymentStatus());
        res.setCreatedAt(r.getCreatedAt());
        res.setNights(ChronoUnit.DAYS.between(r.getCheckInDate(), r.getCheckOutDate()));
        return res;
    }
}
