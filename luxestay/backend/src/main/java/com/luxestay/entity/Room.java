package com.luxestay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    @Min(1)
    @Column(nullable = false)
    private Integer floor = 1;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "price_per_night", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Min(1)
    @Column(nullable = false)
    private Integer capacity = 1;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "has_wifi")
    private Boolean hasWifi = true;

    @Column(name = "has_minibar")
    private Boolean hasMinibar = false;

    @Column(name = "has_balcony")
    private Boolean hasBalcony = false;

    @Column(name = "has_jacuzzi")
    private Boolean hasJacuzzi = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RoomType {
        SIMPLE, DOUBLE, SUITE, PENTHOUSE, FAMILY
    }

    public enum RoomStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
    }
}
