package com.luxestay.serviceImpl;

import com.luxestay.dto.room.*;
import com.luxestay.entity.Room;
import com.luxestay.exception.BadRequestException;
import com.luxestay.exception.ResourceNotFoundException;
import com.luxestay.repository.RoomRepository;
import com.luxestay.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        return toResponse(findRoom(id));
    }

    @Override
    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new BadRequestException("Room number already exists: " + request.getRoomNumber());
        }
        Room room = toEntity(new Room(), request);
        return toResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = findRoom(id);
        if (!room.getRoomNumber().equals(request.getRoomNumber()) &&
            roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new BadRequestException("Room number already exists: " + request.getRoomNumber());
        }
        toEntity(room, request);
        return toResponse(roomRepository.save(room));
    }

    @Override
    public void deleteRoom(Long id) {
        roomRepository.deleteById(findRoom(id).getId());
    }

    @Override
    public List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRooms(checkIn, checkOut)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByStatus(Room.RoomStatus status) {
        return roomRepository.findByStatus(status).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public RoomResponse updateRoomStatus(Long id, Room.RoomStatus status) {
        Room room = findRoom(id);
        room.setStatus(status);
        return toResponse(roomRepository.save(room));
    }

    private Room findRoom(Long id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    private Room toEntity(Room room, RoomRequest req) {
        room.setRoomNumber(req.getRoomNumber());
        room.setRoomType(req.getRoomType());
        room.setFloor(req.getFloor());
        room.setPricePerNight(req.getPricePerNight());
        room.setCapacity(req.getCapacity());
        room.setDescription(req.getDescription());
        room.setImageUrl(req.getImageUrl());
        room.setStatus(req.getStatus() != null ? req.getStatus() : Room.RoomStatus.AVAILABLE);
        room.setHasWifi(req.getHasWifi());
        room.setHasMinibar(req.getHasMinibar());
        room.setHasBalcony(req.getHasBalcony());
        room.setHasJacuzzi(req.getHasJacuzzi());
        return room;
    }

    private RoomResponse toResponse(Room room) {
        RoomResponse r = new RoomResponse();
        r.setId(room.getId());
        r.setRoomNumber(room.getRoomNumber());
        r.setRoomType(room.getRoomType());
        r.setFloor(room.getFloor());
        r.setPricePerNight(room.getPricePerNight());
        r.setCapacity(room.getCapacity());
        r.setDescription(room.getDescription());
        r.setImageUrl(room.getImageUrl());
        r.setStatus(room.getStatus());
        r.setHasWifi(room.getHasWifi());
        r.setHasMinibar(room.getHasMinibar());
        r.setHasBalcony(room.getHasBalcony());
        r.setHasJacuzzi(room.getHasJacuzzi());
        r.setCreatedAt(room.getCreatedAt());
        return r;
    }
}
