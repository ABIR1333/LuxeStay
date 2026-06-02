package com.luxestay.repository;

import com.luxestay.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomNumber(String roomNumber);

    List<Room> findByStatus(Room.RoomStatus status);

    List<Room> findByRoomType(Room.RoomType roomType);

    long countByStatus(Room.RoomStatus status);

    @Query("""
        SELECT r FROM Room r WHERE r.id NOT IN (
            SELECT res.room.id FROM Reservation res
            WHERE res.status NOT IN ('CANCELLED', 'CHECKED_OUT')
            AND res.checkInDate < :checkOut
            AND res.checkOutDate > :checkIn
        )
    """)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
