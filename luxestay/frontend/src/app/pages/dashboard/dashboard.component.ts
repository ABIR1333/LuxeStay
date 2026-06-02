import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/employee.service';
import { DashboardStats } from '../../core/models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  today = new Date();

  // Chart data derived from stats
  revenueLabels: string[] = [];
  revenueData: number[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.revenueLabels = data.monthlyRevenueChart.map(m => m.month);
        this.revenueData = data.monthlyRevenueChart.map(m => m.revenue);
        this.loading = false;
        setTimeout(() => this.drawChart(), 100);
      },
      error: () => { this.loading = false; }
    });
  }

  drawChart(): void {
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas || !this.stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(201,168,76,0.35)');
    gradient.addColorStop(1, 'rgba(201,168,76,0)');

    // @ts-ignore
    if ((window as any).__revenueChart) (window as any).__revenueChart.destroy();

    // @ts-ignore
    (window as any).__revenueChart = new (window as any).Chart(ctx, {
      type: 'line',
      data: {
        labels: this.revenueLabels,
        datasets: [{
          label: 'Revenus (MAD)',
          data: this.revenueData,
          borderColor: '#C9A84C',
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#C9A84C',
          pointBorderColor: '#0A0C0F',
          pointBorderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1C2128',
            borderColor: 'rgba(201,168,76,0.3)',
            borderWidth: 1,
            titleColor: '#C9A84C',
            bodyColor: '#9BA4B0',
            padding: 12
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#5A6474', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#5A6474', font: { size: 11 },
              callback: (v: any) => v >= 1000 ? (v/1000).toFixed(0)+'k' : v
            }
          }
        }
      }
    });
  }

  get occupancyBarWidth(): string {
    return `${this.stats?.occupancyRate ?? 0}%`;
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(val);
  }

  getRoomTypeEntries(): { key: string; value: number }[] {
    if (!this.stats?.roomTypeDistribution) return [];
    return Object.entries(this.stats.roomTypeDistribution).map(([key, value]) => ({ key, value }));
  }

  getStatusEntries(): { key: string; value: number }[] {
    if (!this.stats?.reservationStatusDistribution) return [];
    return Object.entries(this.stats.reservationStatusDistribution).map(([key, value]) => ({ key, value }));
  }
}
