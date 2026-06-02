import { Routes } from '@angular/router';
import { authGuard, loginGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [loginGuard],
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'employees',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/employees/employees.component').then(m => m.EmployeesComponent)
      },
      {
        path: 'checkin',
        loadComponent: () => import('./pages/checkin/checkin.component').then(m => m.CheckinComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
