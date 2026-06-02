import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoomService } from '../../core/services/room.service';
import { AuthService } from '../../core/services/auth.service';
import { Room, RoomRequest, RoomType, RoomStatus } from '../../core/models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  rooms:    Room[] = [];
  filtered: Room[] = [];
  loading  = true;
  showModal = false;
  editMode  = false;
  saving    = false;
  toast: { msg: string; type: string } | null = null;
  filterStatus = '';
  filterType   = '';
  searchQuery  = '';

  readonly roomTypes:    RoomType[]   = ['SIMPLE','DOUBLE','SUITE','PENTHOUSE','FAMILY'];
  readonly roomStatuses: RoomStatus[] = ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'];

  form:   RoomRequest = this.emptyForm();
  editId: number | null = null;

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private subs = new Subscription();   // composite: add all subs here

  constructor(public authService: AuthService, private roomService: RoomService) {}

  ngOnInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  load(): void {
    this.loading = true;
    const sub = this.roomService.getAll().subscribe({
      next:  r  => { this.rooms = r; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.subs.add(sub);
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filtered = this.rooms.filter(r => {
      const matchStatus = !this.filterStatus || r.status   === this.filterStatus;
      const matchType   = !this.filterType   || r.roomType === this.filterType;
      const matchSearch = !q ||
        r.roomNumber.toLowerCase().includes(q) ||
        r.roomType.toLowerCase().includes(q);
      return matchStatus && matchType && matchSearch;
    });
  }

  openCreate(): void {
    this.form     = this.emptyForm();
    this.editMode = false;
    this.editId   = null;
    this.showModal = true;
  }

  openEdit(room: Room): void {
    this.form     = { ...room } as RoomRequest;
    this.editMode = true;
    this.editId   = room.id!;
    this.showModal = true;
  }

  save(): void {
    if (this.saving) return;   // prevent double-submit
    this.saving = true;

    const obs = this.editMode
      ? this.roomService.update(this.editId!, this.form)
      : this.roomService.create(this.form);

    const sub = obs.subscribe({
      next: () => {
        this.showToast(this.editMode ? 'Chambre modifiée' : 'Chambre créée', 'success');
        this.showModal = false;
        this.saving    = false;
        this.load();
      },
      error: (e) => {
        this.showToast(e.error?.message || 'Erreur', 'error');
        this.saving = false;
      }
    });
    this.subs.add(sub);
  }

  delete(id: number): void {
    if (!confirm('Supprimer cette chambre ?')) return;
    const sub = this.roomService.delete(id).subscribe({
      next:  () => { this.showToast('Chambre supprimée', 'success'); this.load(); },
      error: () =>   this.showToast('Erreur lors de la suppression', 'error')
    });
    this.subs.add(sub);
  }

  showToast(msg: string, type: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }

  emptyForm(): RoomRequest {
    return {
      roomNumber: '', roomType: 'SIMPLE', floor: 1, pricePerNight: 0, capacity: 1,
      hasWifi: true, hasMinibar: false, hasBalcony: false, hasJacuzzi: false,
      status: 'AVAILABLE', description: '', imageUrl: ''
    };
  }

  badgeClass(status: string): string { return status.toLowerCase(); }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      AVAILABLE: 'Disponible', OCCUPIED: 'Occupée',
      MAINTENANCE: 'Maintenance', RESERVED: 'Réservée'
    };
    return map[s] ?? s;
  }

  typeIcon(t: string): string {
    const map: Record<string, string> = {
      SIMPLE: '🛏', DOUBLE: '🛏🛏', SUITE: '✨', PENTHOUSE: '👑', FAMILY: '👨‍👩‍👧'
    };
    return map[t] ?? '🛏';
  }

  get stats() {
    return {
      total:       this.rooms.length,
      available:   this.rooms.filter(r => r.status === 'AVAILABLE').length,
      occupied:    this.rooms.filter(r => r.status === 'OCCUPIED').length,
      maintenance: this.rooms.filter(r => r.status === 'MAINTENANCE').length,
    };
  }
}
