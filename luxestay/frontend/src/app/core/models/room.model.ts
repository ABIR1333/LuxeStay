export type RoomType = 'SIMPLE' | 'DOUBLE' | 'SUITE' | 'PENTHOUSE' | 'FAMILY';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export interface Room {
  id?: number;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  pricePerNight: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
  status: RoomStatus;
  hasWifi: boolean;
  hasMinibar: boolean;
  hasBalcony: boolean;
  hasJacuzzi: boolean;
  createdAt?: string;
}

export interface RoomRequest {
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  pricePerNight: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
  status?: RoomStatus;
  hasWifi?: boolean;
  hasMinibar?: boolean;
  hasBalcony?: boolean;
  hasJacuzzi?: boolean;
}
