import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee, EmployeePosition } from '../../core/models/models';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="toast-container" *ngIf="toast"><div class="toast" [class]="toast.type">{{ toast.msg }}</div></div>

<div class="fade-in">
  <div class="page-header">
    <div>
      <h1 class="page-title">Employés</h1>
      <p class="page-subtitle">{{ employees.length }} membre(s) du personnel</p>
    </div>
    <button class="btn-luxe btn-primary" (click)="openCreate()">+ Nouvel employé</button>
  </div>

  <div class="luxe-card" style="padding:0;overflow:hidden">
    <table class="luxe-table" *ngIf="!loading && employees.length > 0">
      <thead><tr>
        <th>#</th><th>Nom</th><th>Poste</th><th>Département</th>
        <th>Email</th><th>Téléphone</th><th>Salaire</th><th>Date embauche</th><th>Statut</th><th>Actions</th>
      </tr></thead>
      <tbody>
        <tr *ngFor="let e of employees">
          <td class="text-muted">{{ e.id }}</td>
          <td><strong style="color:var(--text-primary)">{{ e.firstName }} {{ e.lastName }}</strong></td>
          <td><span class="badge-luxe gold">{{ e.position }}</span></td>
          <td>{{ e.department }}</td>
          <td class="text-muted">{{ e.email }}</td>
          <td>{{ e.phone }}</td>
          <td style="font-family:'Cormorant Garamond',serif;color:var(--gold);font-size:1rem">{{ e.salary | number:'1.0-0' }} MAD</td>
          <td>{{ e.hireDate | date:'dd/MM/yyyy' }}</td>
          <td>
            <span class="badge-luxe" [class]="e.active ? 'available' : 'cancelled'">{{ e.active ? 'Actif' : 'Inactif' }}</span>
          </td>
          <td>
            <div style="display:flex;gap:.4rem">
              <button class="btn-luxe btn-outline btn-icon" (click)="openEdit(e)">✏</button>
              <button class="btn-luxe btn-danger btn-icon" (click)="delete(e.id!)">✕</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="!loading && employees.length === 0" class="empty-state">
      <div class="empty-icon">👤</div><h4>Aucun employé</h4>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal-overlay" *ngIf="showModal" (click)="$event.target===$event.currentTarget&&(showModal=false)">
  <div class="modal-box slide-up">
    <div class="modal-header">
      <h3>{{ editMode ? 'Modifier employé' : 'Nouvel employé' }}</h3>
      <button class="close-btn" (click)="showModal=false">✕</button>
    </div>
    <div class="modal-body">
      <div class="grid-2">
        <div class="form-group"><label>Prénom *</label><input class="form-control" [(ngModel)]="form.firstName"/></div>
        <div class="form-group"><label>Nom *</label><input class="form-control" [(ngModel)]="form.lastName"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>Email</label><input class="form-control" type="email" [(ngModel)]="form.email"/></div>
        <div class="form-group"><label>Téléphone</label><input class="form-control" [(ngModel)]="form.phone"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Poste *</label>
          <select class="form-control" [(ngModel)]="form.position">
            <option *ngFor="let p of positions" [value]="p">{{ p }}</option>
          </select>
        </div>
        <div class="form-group"><label>Département</label><input class="form-control" [(ngModel)]="form.department"/></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>Salaire (MAD)</label><input class="form-control" type="number" [(ngModel)]="form.salary"/></div>
        <div class="form-group"><label>Date d'embauche *</label><input class="form-control" type="date" [(ngModel)]="form.hireDate"/></div>
      </div>
      <div class="form-group">
        <label>Statut</label>
        <select class="form-control" [(ngModel)]="form.active">
          <option [ngValue]="true">Actif</option>
          <option [ngValue]="false">Inactif</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-luxe btn-outline" (click)="showModal=false">Annuler</button>
      <button class="btn-luxe btn-primary" (click)="save()" [disabled]="saving">{{ saving ? '...' : (editMode ? 'Modifier' : 'Créer') }}</button>
    </div>
  </div>
</div>
  `,
  styles: []
})
export class EmployeesComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  loading   = true;
  showModal = false;
  editMode  = false;
  saving    = false;
  editId:   number | null = null;
  toast: { msg: string; type: string } | null = null;
  readonly positions: EmployeePosition[] = ['MANAGER','RECEPTIONIST','HOUSEKEEPER','MAINTENANCE','CHEF','SECURITY'];
  form: Employee = this.empty();

  private subs       = new Subscription();
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private employeeService: EmployeeService) {}
  ngOnInit()    { this.load(); }
  ngOnDestroy() { this.subs.unsubscribe(); if (this.toastTimer) clearTimeout(this.toastTimer); }

  load() {
    this.loading = true;
    this.subs.add(this.employeeService.getAll().subscribe({
      next:  e  => { this.employees = e; this.loading = false; },
      error: () => { this.loading = false; }
    }));
  }

  openCreate() { this.form = this.empty(); this.editMode = false; this.editId = null; this.showModal = true; }
  openEdit(e: Employee) { this.form = { ...e }; this.editMode = true; this.editId = e.id!; this.showModal = true; }

  save() {
    if (this.saving) return;
    this.saving = true;
    const obs = this.editMode
      ? this.employeeService.update(this.editId!, this.form as any)
      : this.employeeService.create(this.form as any);
    this.subs.add(obs.subscribe({
      next:  () => { this.showToast(this.editMode ? 'Employé modifié' : 'Employé créé', 'success'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.showToast(e.error?.message || 'Erreur', 'error'); this.saving = false; }
    }));
  }

  delete(id: number) {
    if (!confirm('Désactiver cet employé ?')) return;
    this.subs.add(this.employeeService.delete(id).subscribe({
      next:  () => { this.showToast('Employé désactivé', 'success'); this.load(); },
      error: () =>   this.showToast('Erreur', 'error')
    }));
  }

  showToast(msg: string, type: string) {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { msg, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }

  empty(): Employee { return { firstName:'', lastName:'', position:'RECEPTIONIST', hireDate: new Date().toISOString().split('T')[0], active: true }; }
}
