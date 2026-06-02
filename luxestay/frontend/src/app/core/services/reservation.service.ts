import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation, ReservationRequest, ReservationStatus } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private API = `${environment.apiUrl}/reservations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> { return this.http.get<Reservation[]>(this.API); }
  getById(id: number): Observable<Reservation> { return this.http.get<Reservation>(`${this.API}/${id}`); }
  getByClient(clientId: number): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${this.API}/client/${clientId}`); }
  create(r: ReservationRequest): Observable<Reservation> { return this.http.post<Reservation>(this.API, r); }
  update(id: number, r: ReservationRequest): Observable<Reservation> { return this.http.put<Reservation>(`${this.API}/${id}`, r); }
  cancel(id: number): Observable<void> { return this.http.patch<void>(`${this.API}/${id}/cancel`, null); }
  checkIn(id: number): Observable<Reservation> { return this.http.patch<Reservation>(`${this.API}/${id}/checkin`, null); }
  checkOut(id: number): Observable<Reservation> { return this.http.patch<Reservation>(`${this.API}/${id}/checkout`, null); }
  updateStatus(id: number, status: ReservationStatus): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.API}/${id}/status`, null, { params: { status } });
  }
}
