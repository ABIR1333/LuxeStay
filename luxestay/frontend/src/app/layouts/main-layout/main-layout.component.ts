import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/auth.model';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
  badge?: number; // ✅ FIX (number ou string ok)
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  sidebarOpen = signal(true);
  currentUser: AuthUser | null = null;
  currentTime = new Date();

  visibleNavItems: NavItem[] = [];

  private clockInterval: ReturnType<typeof setInterval> | null = null;
  private userSub: Subscription | null = null;

  private readonly ALL_NAV: NavItem[] = [
    { label: 'Dashboard', icon: '▦', route: '/dashboard' },
    { label: 'Chambres', icon: '🛏', route: '/rooms' },
    { label: 'Réservations', icon: '📋', route: '/reservations' },
    { label: 'Check-In/Out', icon: '🔑', route: '/checkin' },
    { label: 'Clients', icon: '👥', route: '/clients' },
    { label: 'Employés', icon: '👤', route: '/employees', adminOnly: true }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      this.visibleNavItems = this.ALL_NAV.filter(
        item => !item.adminOnly || this.authService.isAdmin()
      );
    });

    this.clockInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }

    this.userSub?.unsubscribe();
  }

  get userInitials(): string {
    if (!this.currentUser) return '?';

    return (
      (this.currentUser.firstName?.[0] ?? '') +
      (this.currentUser.lastName?.[0] ?? '')
    ).toUpperCase();
  }

  get userRole(): string {
    if (!this.currentUser) return '';

    if (this.currentUser.roles?.includes('ROLE_ADMIN')) {
      return 'Administrateur';
    }

    if (this.currentUser.roles?.includes('ROLE_RECEPTIONIST')) {
      return 'Réceptionniste';
    }

    return 'Utilisateur';
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}