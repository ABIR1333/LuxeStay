import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models/reservation.model';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="toast-container" *ngIf="toast"><div class="toast" [class]="toast.type">{{ toast.msg }}</div></div>

<div class="fade-in">
  <div class="page-header">
    <div>
      <h1 class="page-title">Check-In / Check-Out</h1>
      <p class="page-subtitle">Gestion des arrivées et départs du jour</p>
    </div>
  </div>

  <!-- Tabs -->
  <div class="checkin-tabs">
    <button class="cio-tab" [class.active]="tab==='checkin'" (click)="tab='checkin'">
      <span class="cio-icon">▶</span> Check-In à effectuer ({{ arrivals.length }})
    </button>
    <button class="cio-tab" [class.active]="tab==='checkout'" (click)="tab='checkout'">
      <span class="cio-icon">⏹</span> Check-Out à effectuer ({{ departures.length }})
    </button>
  </div>

  <!-- Check-In List -->
  <div *ngIf="tab === 'checkin'">
    <div *ngIf="loading" class="empty-state"><div class="cio-spinner"></div></div>
    <div *ngIf="!loading && arrivals.length === 0" class="empty-state">
      <div class="empty-icon">✅</div>
      <h4>Aucun check-in prévu aujourd'hui</h4>
      <p>Toutes les arrivées ont été traitées.</p>
    </div>
    <div class="cio-cards" *ngIf="!loading && arrivals.length > 0">
      <div class="cio-card luxe-card" *ngFor="let r of arrivals">
        <div class="cio-card-header">
          <div>
            <div class="cio-name">{{ r.clientFullName }}</div>
            <div class="cio-sub">{{ r.clientPhone }} · {{ r.clientEmail }}</div>
          </div>
          <span class="badge-luxe" [class]="r.status.toLowerCase()">{{ r.status }}</span>
        </div>
        <div class="cio-details">
          <div class="cio-detail"><span class="cio-lbl">Chambre</span><span class="cio-val">{{ r.roomNumber }} · {{ r.roomType }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Arrivée</span><span class="cio-val">{{ r.checkInDate | date:'dd/MM/yyyy' }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Départ</span><span class="cio-val">{{ r.checkOutDate | date:'dd/MM/yyyy' }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Nuits</span><span class="cio-val">{{ r.nights }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Personnes</span><span class="cio-val">{{ r.adults }} adulte(s), {{ r.children }} enfant(s)</span></div>
          <div class="cio-detail"><span class="cio-lbl">Total</span><span class="cio-val gold">{{ r.totalPrice | number:'1.0-0' }} MAD</span></div>
          <div class="cio-detail"><span class="cio-lbl">Paiement</span><span class="badge-luxe" [class]="r.paymentStatus.toLowerCase()">{{ r.paymentStatus }}</span></div>
          <div class="cio-detail" *ngIf="r.specialRequests"><span class="cio-lbl">Demandes</span><span class="cio-val" style="color:var(--warning)">{{ r.specialRequests }}</span></div>
        </div>
        <div class="cio-actions">
          <code class="res-code">{{ r.reservationNo }}</code>
          <button class="btn-luxe btn-success" (click)="doCheckIn(r.id!)">▶ Effectuer Check-In</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Check-Out List -->
  <div *ngIf="tab === 'checkout'">
    <div *ngIf="loading" class="empty-state"><div class="cio-spinner"></div></div>
    <div *ngIf="!loading && departures.length === 0" class="empty-state">
      <div class="empty-icon">✅</div>
      <h4>Aucun check-out prévu aujourd'hui</h4>
    </div>
    <div class="cio-cards" *ngIf="!loading && departures.length > 0">
      <div class="cio-card luxe-card" *ngFor="let r of departures">
        <div class="cio-card-header">
          <div>
            <div class="cio-name">{{ r.clientFullName }}</div>
            <div class="cio-sub">{{ r.clientPhone }}</div>
          </div>
          <span class="badge-luxe checked_in">Check-In</span>
        </div>
        <div class="cio-details">
          <div class="cio-detail"><span class="cio-lbl">Chambre</span><span class="cio-val">{{ r.roomNumber }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Départ prévu</span><span class="cio-val">{{ r.checkOutDate | date:'dd/MM/yyyy' }}</span></div>
          <div class="cio-detail"><span class="cio-lbl">Total dû</span><span class="cio-val gold">{{ r.totalPrice | number:'1.0-0' }} MAD</span></div>
          <div class="cio-detail"><span class="cio-lbl">Paiement</span><span class="badge-luxe" [class]="r.paymentStatus.toLowerCase()">{{ r.paymentStatus }}</span></div>
        </div>
        <div class="cio-actions">
          <code class="res-code">{{ r.reservationNo }}</code>
          <button class="btn-luxe btn-primary" (click)="doCheckOut(r.id!)">⏹ Effectuer Check-Out</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
.checkin-tabs { display:flex;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap; }
.cio-tab { display:flex;align-items:center;gap:.5rem;padding:.65rem 1.25rem;border-radius:var(--radius-md);
  border:1px solid var(--surface-border);background:var(--bg-card);color:var(--text-secondary);
  font-size:.875rem;font-family:'DM Sans',sans-serif;cursor:pointer;transition:var(--transition);
  &.active{border-color:var(--gold);color:var(--gold);background:var(--gold-muted);}
  &:hover:not(.active){border-color:var(--surface-border-hover);color:var(--text-primary);} }
.cio-icon{font-size:.8rem;}
.cio-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.25rem;}
.cio-card{display:flex;flex-direction:column;gap:1rem;}
.cio-card-header{display:flex;justify-content:space-between;align-items:flex-start;}
.cio-name{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:var(--text-primary);}
.cio-sub{font-size:.75rem;color:var(--text-muted);margin-top:.15rem;}
.cio-details{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;}
.cio-detail{display:flex;flex-direction:column;gap:.15rem;}
.cio-lbl{font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);}
.cio-val{font-size:.85rem;color:var(--text-secondary);}
.cio-actions{display:flex;justify-content:space-between;align-items:center;padding-top:.75rem;border-top:1px solid var(--surface-border);}
.res-code{font-size:.75rem;background:var(--gold-muted);color:var(--gold);padding:.2rem .5rem;border-radius:4px;}
.gold{color:var(--gold)!important;}
.cio-spinner{width:32px;height:32px;border:3px solid var(--surface-1);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;margin:2rem auto;display:block;}
@keyframes spin{to{transform:rotate(360deg)}}
  `]
})
export class CheckinComponent implements OnInit, OnDestroy {
  all:     Reservation[] = [];
  loading  = true;
  tab: 'checkin' | 'checkout' = 'checkin';
  toast: { msg: string; type: string } | null = null;

  // Memoised — rebuilt only on data load, not on every CD cycle
  arrivals:   Reservation[] = [];
  departures: Reservation[] = [];

  private subs       = new Subscription();
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private reservationService: ReservationService) {}
  ngOnInit()    { this.load(); }
  ngOnDestroy() { this.subs.unsubscribe(); if (this.toastTimer) clearTimeout(this.toastTimer); }

  load() {
    this.loading = true;
    this.subs.add(this.reservationService.getAll().subscribe({
      next: r => {
        this.all        = r;
        this.arrivals   = r.filter(res => res.status === 'CONFIRMED' || res.status === 'PENDING');
        this.departures = r.filter(res => res.status === 'CHECKED_IN');
        this.loading    = false;
      },
      error: () => { this.loading = false; }
    }));
  }

  doCheckIn(id: number) {
    this.subs.add(this.reservationService.checkIn(id).subscribe({
      next:  () => { this.showToast('✓ Check-in effectué avec succès', 'success'); this.load(); },
      error: (e) => this.showToast(e.error?.message || 'Erreur', 'error')
    }));
  }

  doCheckOut(id: number) {
    this.subs.add(this.reservationService.checkOut(id).subscribe({
      next:  () => { this.showToast('✓ Check-out effectué avec succès', 'success'); this.load(); },
      error: (e) => this.showToast(e.error?.message || 'Erreur', 'error')
    }));
  }

  showToast(msg: string, type: string) {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }
}
