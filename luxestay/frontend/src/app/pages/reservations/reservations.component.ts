import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { ReservationService } from '../../core/services/reservation.service';
import { ClientService }      from '../../core/services/client.service';
import { RoomService }        from '../../core/services/room.service';
import { Reservation, ReservationRequest } from '../../core/models/reservation.model';
import { Client }   from '../../core/models/models';
import { Room }     from '../../core/models/room.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  filtered:     Reservation[] = [];
  clients: Client[] = [];
  rooms:   Room[]   = [];

  loading      = true;
  loadingMeta  = true;   // separate flag for clients/rooms dropdown
  showModal    = false;
  saving       = false;

  toast: { msg: string; type: string } | null = null;
  filterStatus = '';
  searchQuery  = '';
  activeTab: 'all' | 'today' = 'all';

  form: ReservationRequest = this.emptyForm();

  readonly statusList  = ['PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED'];
  readonly paymentList = ['UNPAID','PARTIAL','PAID'];

  // Memoised to avoid recalculating on every CD cycle
  private _totalRevenue = 0;

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private subs = new Subscription();

  constructor(
    private reservationService: ReservationService,
    private clientService:      ClientService,
    private roomService:        RoomService
  ) {}

  ngOnInit(): void {
    // Load reservations + dropdown data once, in parallel via forkJoin
    // forkJoin waits for ALL to complete → no race condition, no repeated calls
    const meta$ = forkJoin({
      clients: this.clientService.getAll(),
      rooms:   this.roomService.getAll()
    });

    const metaSub = meta$.subscribe({
      next: ({ clients, rooms }) => {
        this.clients     = clients;
        this.rooms       = rooms;
        this.loadingMeta = false;
      },
      error: () => { this.loadingMeta = false; }
    });
    this.subs.add(metaSub);

    this.load();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  load(): void {
    this.loading = true;
    const sub = this.reservationService.getAll().subscribe({
      next: r => {
        this.reservations = r;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.subs.add(sub);
  }

  applyFilter(): void {
    const today = new Date().toISOString().split('T')[0];
    const q     = this.searchQuery.toLowerCase();

    this.filtered = this.reservations.filter(r => {
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      const matchSearch = !q ||
        r.clientFullName?.toLowerCase().includes(q) ||
        r.reservationNo?.toLowerCase().includes(q)  ||
        r.roomNumber?.toLowerCase().includes(q);
      const matchTab = this.activeTab === 'all' ||
        (r.checkInDate === today || r.checkOutDate === today);
      return matchStatus && matchSearch && matchTab;
    });

    // Recompute revenue only when filter changes, not on every CD cycle
    this._totalRevenue = this.filtered
      .filter(r => r.paymentStatus === 'PAID')
      .reduce((sum, r) => sum + r.totalPrice, 0);
  }

  openCreate(): void {
    this.form      = this.emptyForm();
    this.showModal = true;
  }

  save(): void {
    if (this.saving) return;   // prevent double-click
    if (!this.form.clientId || !this.form.roomId) {
      this.showToast('Veuillez sélectionner un client et une chambre', 'error');
      return;
    }
    this.saving = true;

    const sub = this.reservationService.create(this.form).subscribe({
      next: () => {
        this.showToast('Réservation créée avec succès', 'success');
        this.showModal = false;
        this.saving    = false;
        this.load();
      },
      error: (e) => {
        this.showToast(e.error?.message || 'Erreur lors de la création', 'error');
        this.saving = false;
      }
    });
    this.subs.add(sub);
  }

  checkIn(id: number): void {
    const sub = this.reservationService.checkIn(id).subscribe({
      next: () => { this.showToast('Check-in effectué', 'success'); this.load(); },
      error: (e) => this.showToast(e.error?.message || 'Erreur', 'error')
    });
    this.subs.add(sub);
  }

  checkOut(id: number): void {
    const sub = this.reservationService.checkOut(id).subscribe({
      next: () => { this.showToast('Check-out effectué', 'success'); this.load(); },
      error: (e) => this.showToast(e.error?.message || 'Erreur', 'error')
    });
    this.subs.add(sub);
  }

  cancel(id: number): void {
    if (!confirm('Annuler cette réservation ?')) return;
    const sub = this.reservationService.cancel(id).subscribe({
      next:  () => { this.showToast('Réservation annulée', 'success'); this.load(); },
      error: () =>   this.showToast('Erreur', 'error')
    });
    this.subs.add(sub);
  }

  showToast(msg: string, type: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
  }

  emptyForm(): ReservationRequest {
    const today    = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];
    return { clientId: 0, roomId: 0, checkInDate: today, checkOutDate: tomorrow, adults: 1, children: 0 };
  }

  canCheckIn(r: Reservation):  boolean { return r.status === 'CONFIRMED' || r.status === 'PENDING'; }
  canCheckOut(r: Reservation): boolean { return r.status === 'CHECKED_IN'; }
  canCancel(r: Reservation):   boolean { return !['CHECKED_OUT','CANCELLED'].includes(r.status); }

  badgeClass(s: string): string { return s.toLowerCase(); }
  payBadge(s: string):   string { return s.toLowerCase(); }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      PENDING: 'En attente', CONFIRMED: 'Confirmée',
      CHECKED_IN: 'Check-In', CHECKED_OUT: 'Check-Out', CANCELLED: 'Annulée'
    };
    return map[s] ?? s;
  }

  /** Pre-computed — no recalculation on every change detection pass */
  get totalRevenue(): number { return this._totalRevenue; }
}
