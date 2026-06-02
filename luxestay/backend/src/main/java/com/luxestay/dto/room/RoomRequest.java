package com.luxestay.dto.room;

import com.luxestay.entity.Room;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RoomRequest {
    @NotBlank private String roomNumber;
    @NotNull  private Room.RoomType roomType;
    @Min(1)   private Integer floor = 1;
    @NotNull @DecimalMin("0.00") private BigDecimal pricePerNight;
    @Min(1)   private Integer capacity = 1;
    private String description;
    private String imageUrl;
    private Room.RoomStatus status = Room.RoomStatus.AVAILABLE;
    private Boolean hasWifi = true;
    private Boolean hasMinibar = false;
    private Boolean hasBalcony = false;
    private Boolean hasJacuzzi = false;
}
