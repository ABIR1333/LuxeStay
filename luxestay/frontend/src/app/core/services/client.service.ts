import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private API = `${environment.apiUrl}/clients`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Client[]> { return this.http.get<Client[]>(this.API); }
  getById(id: number): Observable<Client> { return this.http.get<Client>(`${this.API}/${id}`); }
  search(query: string): Observable<Client[]> { return this.http.get<Client[]>(`${this.API}/search`, { params: { query } }); }
  create(c: Client): Observable<Client> { return this.http.post<Client>(this.API, c); }
  update(id: number, c: Client): Observable<Client> { return this.http.put<Client>(`${this.API}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}
