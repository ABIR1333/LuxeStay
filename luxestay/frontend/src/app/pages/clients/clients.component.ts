import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="toast-container" *ngIf="toast">
  <div class="toast" [class]="toast.type">{{ toast.msg }}</div>
</div>

<div class="fade-in">
  <div class="page-header">
    <div>
      <h1 class="page-title">Clients</h1>
      <p class="page-subtitle">{{ filtered.length }} client(s) enregistré(s)</p>
    </div>
    <button class="btn-luxe btn-primary" (click)="openCreate()">+ Nouveau client</button>
  </div>

  <div class="luxe-card filters-bar">
    <input class="form-control" style="flex:1" type="text" placeholder="🔍 Rechercher un client..."
      [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()"/>
  </div>

  <div class="luxe-card" style="padding:0;overflow:hidden">
    <table class="luxe-table" *ngIf="!loading && filtered.length > 0">
      <thead><tr>
        <th>#</th><th>Nom</th><th>Email</th><th>Téléphone</th>
        <th>Ville</th><th>Pays</th><th>Carte ID</th><th>Actions</th>
      </tr></thead>
      <tbody>
        <tr *ngFor="let c of filtered">
          <td class="text-muted">{{ c.id }}</td>
          <td><strong style="color:var(--text-primary)">{{ c.firstName }} {{ c.lastName }}</strong></td>
          <td class="text-muted">{{ c.email }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.city }}</td>
          <td>{{ c.country }}</td>
          <td><code style="font-size:.75rem;color:var(--gold)">{{ c.idCard }}</code></td>
          <td>
            <div style="display:flex;gap:.4rem">
              <button class="btn-luxe btn-outline btn-icon" (click)="openEdit(c)">✏</button>
              <button class="btn-luxe btn-danger btn-icon" (click)="delete(c.id!)">✕</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="!loading && filtered.length === 0" class="empty-state">
      <div class="empty-icon">👥</div><h4>Aucun client trouvé</h4>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal-overlay" *ngIf="showModal" (click)="$event.target===$event.currentTarget&&(showModal=false)">
  <div class="modal-box slide-up">
    <div class="modal-header">
      <h3>{{ editMode ? 'Modifier le client' : 'Nouveau client' }}</h3>
      <button class="close-btn" (click)="showModal=false">✕</button>
    </div>
    <div class="modal-body">
      <div class="grid-2">
        <div class="form-group"><label>Prénom *</label><input class="form-control" [(ngModel)]="form.firstName" placeholder="Ahmed"/></div>
        <div class="form-group"><label>Nom *</label><input class="form-control" [(ngModel)]="form.lastName" placeholder="Benali"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>Email</label><input class="form-control" type="email" [(ngModel)]="form.email" placeholder="ahmed@email.com"/></div>
        <div class="form-group"><label>Téléphone</label><input class="form-control" [(ngModel)]="form.phone" placeholder="+212..."/></div>
      </div>
      <div class="form-group"><label>Adresse</label><input class="form-control" [(ngModel)]="form.address"/></div>
      <div class="grid-2">
        <div class="form-group"><label>Ville</label><input class="form-control" [(ngModel)]="form.city"/></div>
        <div class="form-group"><label>Pays</label><input class="form-control" [(ngModel)]="form.country"/></div>
      </div>
      <div class="form-group"><label>N° Carte ID</label><input class="form-control" [(ngModel)]="form.idCard"/></div>
    </div>
    <div class="modal-footer">
      <button class="btn-luxe btn-outline" (click)="showModal=false">Annuler</button>
      <button class="btn-luxe btn-primary" (click)="save()" [disabled]="saving">
        {{ saving ? '...' : (editMode ? 'Modifier' : 'Créer') }}
      </button>
    </div>
  </div>
</div>
  `,
  styles: [`.filters-bar{display:flex;gap:.875rem;margin-bottom:1.25rem;padding:1rem 1.25rem;}`]
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients:  Client[] = [];
  filtered: Client[] = [];
  loading   = true;
  showModal = false;
  editMode  = false;
  saving    = false;
  editId:   number | null = null;
  searchQuery = '';
  toast: { msg: string; type: string } | null = null;
  form: Client = this.empty();

  private subs       = new Subscription();
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private clientService: ClientService) {}
  ngOnInit()    { this.load(); }
  ngOnDestroy() { this.subs.unsubscribe(); if (this.toastTimer) clearTimeout(this.toastTimer); }

  load() {
    this.loading = true;
    this.subs.add(this.clientService.getAll().subscribe({
      next:  c  => { this.clients = c; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    }));
  }

  applyFilter() {
    const q = this.searchQuery.toLowerCase();
    this.filtered = this.clients.filter(c =>
      !q || `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q)
    );
  }

  openCreate() { this.form = this.empty(); this.editMode = false; this.editId = null; this.showModal = true; }
  openEdit(c: Client) { this.form = { ...c }; this.editMode = true; this.editId = c.id!; this.showModal = true; }

  save() {
    if (this.saving) return;
    this.saving = true;
    const obs = this.editMode
      ? this.clientService.update(this.editId!, this.form)
      : this.clientService.create(this.form);
    this.subs.add(obs.subscribe({
      next:  () => { this.showToast(this.editMode ? 'Client modifié' : 'Client créé', 'success'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.showToast(e.error?.message || 'Erreur', 'error'); this.saving = false; }
    }));
  }

  delete(id: number) {
    if (!confirm('Supprimer ce client ?')) return;
    this.subs.add(this.clientService.delete(id).subscribe({
      next:  () => { this.showToast('Client supprimé', 'success'); this.load(); },
      error: () =>   this.showToast('Erreur', 'error')
    }));
  }

  showToast(msg: string, type: string) {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }

  empty(): Client { return { firstName:'', lastName:'', email:'', phone:'', address:'', city:'', country:'Morocco', idCard:'' }; }
}
