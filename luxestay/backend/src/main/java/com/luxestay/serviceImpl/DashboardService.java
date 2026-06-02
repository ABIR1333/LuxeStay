package com.luxestay.serviceImpl;

import com.luxestay.dto.dashboard.DashboardStats;
import com.luxestay.entity.Reservation;
import com.luxestay.entity.Room;
import com.luxestay.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class DashboardService {

    @Autowired private RoomRepository roomRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private ClientRepository clientRepository;
    @Autowired private EmployeeRepository employeeRepository;

    public DashboardStats getStats() {
        // Room stats
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(Room.RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(Room.RoomStatus.OCCUPIED);
        long maintenanceRooms = roomRepository.countByStatus(Room.RoomStatus.MAINTENANCE);

        // Reservation stats
        long totalRes = reservationRepository.count();
        long pendingRes = reservationRepository.countByStatus(Reservation.ReservationStatus.PENDING);
        long confirmedRes = reservationRepository.countByStatus(Reservation.ReservationStatus.CONFIRMED);
        long checkedIn = reservationRepository.countByStatus(Reservation.ReservationStatus.CHECKED_IN);

        // Revenue
        BigDecimal totalRevenue = reservationRepository.getTotalRevenue();
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        BigDecimal monthlyRevenue = reservationRepository.getMonthlyRevenue(currentMonth, currentYear);

        // Occupancy rate
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;

        // Monthly revenue chart (last 6 months)
        List<DashboardStats.MonthlyRevenue> chart = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusMonths(i);
            BigDecimal rev = reservationRepository.getMonthlyRevenue(d.getMonthValue(), d.getYear());
            chart.add(DashboardStats.MonthlyRevenue.builder()
                .month(d.getMonth().getDisplayName(TextStyle.SHORT, Locale.FRENCH))
                .revenue(rev != null ? rev : BigDecimal.ZERO)
                .build());
        }

        // Room type distribution
        Map<String, Long> roomTypes = new LinkedHashMap<>();
        for (Room.RoomType type : Room.RoomType.values()) {
            roomTypes.put(type.name(), roomRepository.findByRoomType(type).stream().count());
        }

        // Reservation status distribution
        Map<String, Long> statusDist = new LinkedHashMap<>();
        for (Reservation.ReservationStatus s : Reservation.ReservationStatus.values()) {
            statusDist.put(s.name(), reservationRepository.countByStatus(s));
        }

        return DashboardStats.builder()
            .totalRooms(totalRooms)
            .availableRooms(availableRooms)
            .occupiedRooms(occupiedRooms)
            .maintenanceRooms(maintenanceRooms)
            .totalReservations(totalRes)
            .pendingReservations(pendingRes)
            .confirmedReservations(confirmedRes)
            .checkedInReservations(checkedIn)
            .totalClients(clientRepository.count())
            .totalEmployees(employeeRepository.count())
            .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
            .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO)
            .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
            .monthlyRevenueChart(chart)
            .roomTypeDistribution(roomTypes)
            .reservationStatusDistribution(statusDist)
            .build();
    }
}
