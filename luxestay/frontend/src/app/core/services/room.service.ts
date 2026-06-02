import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, RoomRequest, RoomStatus } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private API = `${environment.apiUrl}/rooms`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Room[]> { return this.http.get<Room[]>(this.API); }
  getById(id: number): Observable<Room> { return this.http.get<Room>(`${this.API}/${id}`); }
  create(room: RoomRequest): Observable<Room> { return this.http.post<Room>(this.API, room); }
  update(id: number, room: RoomRequest): Observable<Room> { return this.http.put<Room>(`${this.API}/${id}`, room); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
  updateStatus(id: number, status: RoomStatus): Observable<Room> {
    return this.http.patch<Room>(`${this.API}/${id}/status`, null, { params: { status } });
  }
  getAvailable(checkIn: string, checkOut: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.API}/available`, { params: { checkIn, checkOut } });
  }
}
