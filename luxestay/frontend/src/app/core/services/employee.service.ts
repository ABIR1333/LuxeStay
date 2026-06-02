import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, DashboardStats } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private API = `${environment.apiUrl}/employees`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Employee[]> { return this.http.get<Employee[]>(this.API); }
  getById(id: number): Observable<Employee> { return this.http.get<Employee>(`${this.API}/${id}`); }
  create(e: Employee): Observable<Employee> { return this.http.post<Employee>(this.API, e); }
  update(id: number, e: Employee): Observable<Employee> { return this.http.put<Employee>(`${this.API}/${id}`, e); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private API = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}
  getStats(): Observable<DashboardStats> { return this.http.get<DashboardStats>(`${this.API}/stats`); }
}
