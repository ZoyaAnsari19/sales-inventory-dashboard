import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../../../models/product.interface';
import { ProductService } from '../../../services/product.service';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="container mt-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
        <h4 class="m-0">📦 Product Inventory</h4>
        <div>
          <a routerLink="/products/add" class="btn btn-primary me-2">
            <mat-icon class="me-1">add</mat-icon> Add Product
          </a>
          <button class="btn btn-secondary" (click)="exportProducts()">
            <mat-icon class="me-1">download</mat-icon> Export CSV
          </button>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-sm-6 col-md-4" *ngFor="let product of products$ | async">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">{{ product.productName }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ product.category }}</h6>
              <p class="card-text">
                <strong>Stock:</strong>
                <span [class.text-danger]="product.stock < 10">{{ product.stock }}</span><br>
                <strong>Price:</strong> ₹{{ product.price | number:'1.2-2' }}
              </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <a [routerLink]="['/products/edit', product._id]" class="btn btn-sm btn-primary">
                <mat-icon>edit</mat-icon>
              </a>
              <button (click)="deleteProduct(product)" class="btn btn-sm btn-danger">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-danger { color: #f44336; font-weight: bold; }
    .card-title { font-size: 1.2rem; margin-bottom: 0.25rem; }
    .card-footer { background-color: #f8f9fa; }
    mat-icon { vertical-align: middle; }
    .btn mat-icon { margin-right: 4px; }
  `]
})
export class ProductListComponent implements OnInit {
  products$; // declare only
  isSmallScreen = false;

  constructor(
    private productService: ProductService,
    private exportService: ExportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    // initialize after productService is ready
    this.products$ = this.productService.products$;

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Are you sure you want to delete "${product.productName}"?`)) return;

    this.productService.deleteProduct(product._id!).subscribe({
      next: () => {
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
      }
    });
  }

  async exportProducts(): Promise<void> {
    try {
      const products = await firstValueFrom(this.productService.products$);
      if (!products || products.length === 0) {
        this.snackBar.open('No products to export', 'Close', { duration: 3000 });
        return;
      }
      this.exportService.exportProductsToCSV(products);
      this.snackBar.open('Products exported successfully', 'Close', { duration: 3000 });
    } catch (err) {
      console.error('Export error', err);
      this.snackBar.open('Error exporting products', 'Close', { duration: 3000 });
    }
  }
}
