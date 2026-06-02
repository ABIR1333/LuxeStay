package com.luxestay.service;

import com.luxestay.dto.room.*;
import com.luxestay.entity.Room;
import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    List<RoomResponse> getAllRooms();
    RoomResponse getRoomById(Long id);
    RoomResponse createRoom(RoomRequest request);
    RoomResponse updateRoom(Long id, RoomRequest request);
    void deleteRoom(Long id);
    List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut);
    List<RoomResponse> getRoomsByStatus(Room.RoomStatus status);
    RoomResponse updateRoomStatus(Long id, Room.RoomStatus status);
}
