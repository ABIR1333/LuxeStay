package com.luxestay.dto.room;

import com.luxestay.entity.Room;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Room.RoomType roomType;
    private Integer floor;
    private BigDecimal pricePerNight;
    private Integer capacity;
    private String description;
    private String imageUrl;
    private Room.RoomStatus status;
    private Boolean hasWifi;
    private Boolean hasMinibar;
    private Boolean hasBalcony;
    private Boolean hasJacuzzi;
    private LocalDateTime createdAt;
}
