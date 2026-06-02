export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID';

export interface Reservation {
  id?: number;
  reservationNo: string;
  clientId: number;
  clientFullName: string;
  clientEmail?: string;
  clientPhone?: string;
  roomId: number;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: ReservationStatus;
  specialRequests?: string;
  paymentStatus: PaymentStatus;
  createdAt?: string;
  nights: number;
}

export interface ReservationRequest {
  clientId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  specialRequests?: string;
  paymentStatus?: PaymentStatus;
}
