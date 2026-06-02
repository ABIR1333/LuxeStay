import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="auth-page">
  <div class="auth-form-panel" style="width:100%;max-width:480px;margin:auto;padding:2rem;">
    <div class="auth-form-container fade-in">
      <div class="form-header">
        <h2>Créer un compte</h2>
        <p>Accès réservé aux administrateurs</p>
      </div>
      <div class="error-alert" *ngIf="error"><span>⚠</span> {{ error }}</div>
      <div class="success-alert" *ngIf="success"><span>✓</span> {{ success }}</div>
      <form (ngSubmit)="onSubmit()" #f="ngForm">
        <div class="grid-2">
          <div class="form-group">
            <label>Prénom</label>
            <input class="form-control" type="text" [(ngModel)]="model.firstName" name="firstName" required placeholder="Jean"/>
          </div>
          <div class="form-group">
            <label>Nom</label>
            <input class="form-control" type="text" [(ngModel)]="model.lastName" name="lastName" required placeholder="Dupont"/>
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" type="email" [(ngModel)]="model.email" name="email" required placeholder="jean@luxestay.com"/>
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input class="form-control" type="password" [(ngModel)]="model.password" name="password" required minlength="6" placeholder="••••••"/>
        </div>
        <div class="form-group">
          <label>Rôle</label>
          <select class="form-control" [(ngModel)]="selectedRole" name="role">
            <option value="RECEPTIONIST">Réceptionniste</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
        <button type="submit" class="btn-luxe btn-primary" style="width:100%;justify-content:center;" [disabled]="loading">
          <span *ngIf="!loading">Créer le compte</span>
          <span *ngIf="loading">Création...</span>
        </button>
      </form>
      <p style="text-align:center;margin-top:1.5rem;font-size:.85rem;color:var(--text-muted)">
        Déjà un compte ? <a routerLink="/auth/login" style="color:var(--gold)">Se connecter</a>
      </p>
    </div>
  </div>
</div>`,
  styles: [`.auth-page{display:flex;min-height:100vh;align-items:center;justify-content:center;background:var(--bg-primary);}
  .success-alert{padding:.75rem 1rem;background:var(--success-bg);border:1px solid rgba(46,204,113,.3);border-radius:var(--radius-sm);color:var(--success);font-size:.85rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem;}
  .error-alert{padding:.75rem 1rem;background:var(--danger-bg);border:1px solid rgba(231,76,60,.3);border-radius:var(--radius-sm);color:var(--danger);font-size:.85rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem;}
  .form-header{margin-bottom:2rem;}
  .form-header h2{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--text-primary);}
  .form-header p{font-size:.85rem;color:var(--text-muted);}
  `]
})
export class RegisterComponent {
  model = { firstName: '', lastName: '', email: '', password: '' };
  selectedRole = 'RECEPTIONIST';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService.register({ ...this.model, roles: [this.selectedRole] }).subscribe({
      next: () => {
        this.success = 'Compte créé avec succès. Redirection...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création.';
        this.loading = false;
      }
    });
  }
}
