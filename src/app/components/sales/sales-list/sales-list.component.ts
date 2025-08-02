import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Sale } from '../../../models/sale.interface';
import { SalesService } from '../../../services/sales.service';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule
  ],
  template: `
    <div class="sales-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Sales Management</mat-card-title>
          <div class="spacer"></div>
          <button mat-raised-button color="primary" routerLink="/sales/new">
            <mat-icon>add</mat-icon> New Sale
          </button>
          <button mat-raised-button (click)="exportSales()">
            <mat-icon>download</mat-icon> Export CSV
          </button>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <!-- All Sales Tab -->
            <mat-tab label="All Sales">
              <div class="tab-content">
                <table mat-table [dataSource]="(allSales$ | async) || []" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="productName">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.productName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
                  </ng-container>

                  <ng-container matColumnDef="unitPrice">
                    <th mat-header-cell *matHeaderCellDef>Unit Price</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.unitPrice | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="totalAmount">
                    <th mat-header-cell *matHeaderCellDef>Total</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.totalAmount | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="saleDate">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.saleDate | date:'short' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Today's Sales Tab -->
            <mat-tab label="Today's Sales">
              <div class="tab-content">
                <table mat-table [dataSource]="(todaySales$ | async) || []" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="productName">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.productName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
                  </ng-container>

                  <ng-container matColumnDef="unitPrice">
                    <th mat-header-cell *matHeaderCellDef>Unit Price</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.unitPrice | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="totalAmount">
                    <th mat-header-cell *matHeaderCellDef>Total</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.totalAmount | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="saleDate">
                    <th mat-header-cell *matHeaderCellDef>Time</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.saleDate | date:'shortTime' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="todayColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: todayColumns;"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- This Week Tab -->
            <mat-tab label="This Week">
              <div class="tab-content">
                <table mat-table [dataSource]="(weekSales$ | async) || []" class="mat-elevation-z8">

                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.id }}</td>
                  </ng-container>

                  <ng-container matColumnDef="productName">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.productName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="quantity">
                    <th mat-header-cell *matHeaderCellDef>Quantity</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
                  </ng-container>

                  <ng-container matColumnDef="unitPrice">
                    <th mat-header-cell *matHeaderCellDef>Unit Price</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.unitPrice | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="totalAmount">
                    <th mat-header-cell *matHeaderCellDef>Total</th>
                    <td mat-cell *matCellDef="let sale">\${{ sale.totalAmount | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="saleDate">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let sale">{{ sale.saleDate | date:'short' }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="weekColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: weekColumns;"></tr>
                </table>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .sales-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .tab-content {
      padding-top: 16px;
    }

    table {
      margin-top: 16px;
    }
  `]
})
export class SalesListComponent implements OnInit {
  allSales$: Observable<Sale[]>;
  todaySales$: Observable<Sale[]>;
  weekSales$: Observable<Sale[]>;

  displayedColumns: string[] = ['id', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'saleDate'];
  todayColumns: string[] = ['id', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'saleDate'];
  weekColumns: string[] = ['id', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'saleDate'];

  constructor(
    private salesService: SalesService,
    private exportService: ExportService,
    private snackBar: MatSnackBar
  ) {
    this.allSales$ = this.salesService.getSales();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.todaySales$ = this.salesService.getSalesByDateRange(today, tomorrow);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    this.weekSales$ = this.salesService.getSalesByDateRange(weekStart, tomorrow);
  }

  ngOnInit(): void {}

  exportSales(): void {
    this.allSales$.subscribe(sales => {
      this.exportService.exportSalesToCSV(sales);
      this.snackBar.open('Sales data exported successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });
  }
}
