import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SalesService } from '../../services/sales.service';
import { ExportService } from '../../services/export.service';
import { Product } from '../../models/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="reports-container">
      <h1>Reports & Export</h1>

      <div class="reports-grid">
        <!-- Inventory Summary -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Inventory Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-stats" *ngIf="inventorySummary$ | async as summary">
              <div class="stat"><strong>Total Products:</strong> {{ summary.totalProducts }}</div>
              <div class="stat"><strong>Total Stock Value:</strong> \${{ summary.totalValue | number:'1.2-2' }}</div>
              <div class="stat"><strong>Low Stock Items:</strong> {{ summary.lowStockItems }}</div>
              <div class="stat"><strong>Out of Stock:</strong> {{ summary.outOfStock }}</div>
            </div>
          </mat-card-content>
          <mat-card-actions>
             <button mat-raised-button color="primary" (click)="exportInventory()">
               <mat-icon>download</mat-icon>
               Export Inventory
              </button>
          </mat-card-actions>
        </mat-card>

        <!-- Sales Summary -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Sales Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-stats" *ngIf="salesSummary$ | async as summary">
              <div class="stat"><strong>Total Sales:</strong> {{ summary.totalSales }}</div>
              <div class="stat"><strong>Total Revenue:</strong> \${{ summary.totalRevenue | number:'1.2-2' }}</div>
              <div class="stat"><strong>Average Sale:</strong> \${{ summary.averageSale | number:'1.2-2' }}</div>
              <div class="stat"><strong>Today's Sales:</strong> {{ summary.todaySales }}</div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="exportSalesReport()">
              <mat-icon>download</mat-icon> Export Sales
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Top Products -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Top Products</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="(topProducts$ | async) || []" class="mat-elevation-z8">
              <ng-container matColumnDef="productName">
                <th mat-header-cell *matHeaderCellDef>Product</th>
                <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
              </ng-container>

              <ng-container matColumnDef="totalSold">
                <th mat-header-cell *matHeaderCellDef>Units Sold</th>
                <td mat-cell *matCellDef="let item">{{ item.totalSold }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="topProductsColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: topProductsColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Quick Actions -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-raised-button color="primary" (click)="exportAllData()">
                Export All Data
              </button>
              <button mat-raised-button color="accent" (click)="printSummary()">
                Print Summary
              </button>
              <button mat-raised-button color="warn" (click)="viewAnalytics()">
                View Analytics
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .reports-container h1 {
      color: #3f51b5;
      margin-bottom: 24px;
      text-align: center;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .summary-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .stat:last-child {
      border-bottom: none;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
    }

    .quick-actions button {
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 8px;
      text-transform: capitalize;
    }

    mat-card-actions {
      padding: 16px;
    }
  `]
})
export class ReportsComponent implements OnInit {
  inventorySummary$!: Observable<any>;
  salesSummary$!: Observable<any>;
  topProducts$!: Observable<any[]>;

  topProductsColumns = ['productName', 'totalSold'];

  constructor(
    private productService: ProductService,
    private salesService: SalesService,
    private exportService: ExportService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupObservables();
  }

  private setupObservables(): void {
    this.inventorySummary$ = this.productService.getProducts().pipe(
      map(products => ({
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        lowStockItems: products.filter(p => p.stock < 10 && p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length
      }))
    );

    this.salesSummary$ = this.salesService.getSales().pipe(
      map(sales => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySales = sales.filter(s => new Date(s.saleDate) >= today);
        const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        return {
          totalSales: sales.length,
          totalRevenue,
          averageSale: sales.length ? totalRevenue / sales.length : 0,
          todaySales: todaySales.length
        };
      })
    );

    this.topProducts$ = this.salesService.getTopSellingProducts(5);
  }

  exportInventory(): void {
  this.productService.getProducts().subscribe(products => {
    this.exportService.exportProductsToCSV(products);
    this.snackBar.open('Inventory exported successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  });
}


  exportInventoryReport(): void {
    this.productService.getProducts().subscribe(products => {
      this.exportService.exportProductsToCSV(products);
      this.snackBar.open('Inventory report exported successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  exportSalesReport(): void {
    this.salesService.getSales().subscribe(sales => {
      this.exportService.exportSalesToCSV(sales);
      this.snackBar.open('Sales report exported successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }

  exportAllData(): void {
    this.productService.getProducts().subscribe(inventory => {
      this.salesService.getSales().subscribe(sales => {
        const combinedData = [...inventory, ...sales];
        const csvContent = this.convertToCSV(combinedData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'all_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.snackBar.open('All data exported successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      });
    });
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(row => keys.map(k => `"${row[k]}"`).join(','));
    return [header, ...rows].join('\r\n');
  }

  printSummary(): void {
    window.print();
  }

  viewAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
}
