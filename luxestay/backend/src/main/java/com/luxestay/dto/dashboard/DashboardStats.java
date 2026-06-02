package com.luxestay.dto.dashboard;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long checkedInReservations;
    private long totalClients;
    private long totalEmployees;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private double occupancyRate;
    private List<MonthlyRevenue> monthlyRevenueChart;
    private Map<String, Long> roomTypeDistribution;
    private Map<String, Long> reservationStatusDistribution;

    @Data
    @Builder
    public static class MonthlyRevenue {
        private String month;
        private BigDecimal revenue;
    }
}
