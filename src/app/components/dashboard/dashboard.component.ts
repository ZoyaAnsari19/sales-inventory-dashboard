import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SalesService } from '../../services/sales.service';
import { Sale } from '../../models/sale.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="container mt-4">
      <h3 class="mb-3">Dashboard Overview</h3>

      <mat-grid-list [cols]="gridCols" rowHeight="200px" gutterSize="16px" class="stats-grid">
        <mat-grid-tile *ngFor="let stat of stats" [style.background]="stat.color" class="stat-tile">
          <div class="d-flex flex-column align-items-center justify-content-center text-white text-center">
            <i class="{{ stat.icon }} fa-2x mb-2"></i>
            <h5>{{ stat.label }}</h5>
            <h3>{{ stat.value }}</h3>
          </div>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Stylish Quick Actions Section -->
      <mat-card class="quick-actions-card mt-4">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions-grid">
            <button mat-raised-button color="primary" class="quick-action-btn" (click)="navigateTo('Add Product')">
              <mat-icon>add</mat-icon>
              Add Product
            </button>

            <button mat-raised-button color="accent" class="quick-action-btn" (click)="navigateTo('New Sale')">
              <mat-icon>point_of_sale</mat-icon>
              New Sale
            </button>

            <button mat-raised-button color="warn" class="quick-action-btn" (click)="navigateTo('View Analytics')">
              <mat-icon>bar_chart</mat-icon>
              View Analytics
            </button>

            <button mat-raised-button color="primary" class="quick-action-btn" (click)="navigateTo('Generate Report')">
              <mat-icon>description</mat-icon>
              Generate Report
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stat-tile {
      border-radius: 12px;
      padding: 12px;
      transition: transform 0.3s ease;
    }

    .stat-tile:hover {
      transform: translateY(-4px);
    }

    .quick-actions-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .quick-actions-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: space-between;
      padding: 12px 0;
    }

    .quick-action-btn {
      flex: 1 1 calc(50% - 16px);
      min-width: 150px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      border-radius: 10px;
      text-transform: none;
    }

    @media (max-width: 600px) {
      .stat-tile {
        padding: 8px;
      }

      .quick-action-btn {
        flex: 1 1 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  gridCols = 4;

  stats = [
    { icon: 'fas fa-box', label: 'Total Products', value: '0', color: '#28a745' },
    { icon: 'fas fa-shopping-cart', label: 'Total Sales', value: '0', color: '#007bff' },
    { icon: 'fas fa-dollar-sign', label: 'Total Revenue', value: '₹0', color: '#fd7e14' },
    { icon: 'fas fa-warehouse', label: 'Items in Stock', value: '0', color: '#6f42c1' },
  ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.updateGridCols();
    this.loadStats();
    window.addEventListener('resize', () => this.updateGridCols());
  }

  updateGridCols() {
    const width = window.innerWidth;
    this.gridCols = width < 600 ? 1 : width < 960 ? 2 : width < 1280 ? 3 : 4;
  }

  navigateTo(action: string) {
    switch (action) {
      case 'Add Product':
        this.router.navigate(['/products']);
        break;
      case 'New Sale':
        this.router.navigate(['/sales']);
        break;
      case 'View Analytics':
        this.router.navigate(['/analytics']);
        break;
      case 'Generate Report':
        this.router.navigate(['/reports']);
        break;
    }
  }

  loadStats() {
    // Products data
    this.productService.getProducts().subscribe((products) => {
      const totalStock = products.reduce((sum: number, p) => sum + p.stock, 0);
      this.stats[0].value = products.length.toString();
      this.stats[3].value = totalStock.toString();
    });

    // Sales data
    this.salesService.getSales().subscribe((sales: Sale[]) => {
      const totalRevenue = sales.reduce((sum: number, s: Sale) => sum + s.totalAmount, 0);
      this.stats[1].value = sales.length.toString();
      this.stats[2].value = '₹' + totalRevenue.toString();
    });
  }
}