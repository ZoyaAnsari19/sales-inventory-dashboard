import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, combineLatest, map } from 'rxjs';
import { Product } from '../../../models/product.interface';
import { ProductService } from '../../../services/product.service';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="sales-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>New Sale</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="salesForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="full-width">
                <mat-label>Select Product</mat-label>
                <mat-select formControlName="productId" required (selectionChange)="onProductChange()">
                  <mat-option *ngFor="let product of availableProducts$ | async" [value]="product.id">
                    {{ product.name }} - Stock: {{ product.stock }} - \${{ product.price | number:'1.2-2' }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="salesForm.get('productId')?.hasError('required')">
                  Please select a product
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row" *ngIf="selectedProduct">
              <div class="product-info">
                <h3>{{ selectedProduct.name }}</h3>
                <p><strong>Category:</strong> {{ selectedProduct.category }}</p>
                <p><strong>Available Stock:</strong> {{ selectedProduct.stock }} units</p>
                <p><strong>Unit Price:</strong> \${{ selectedProduct.price | number:'1.2-2' }}</p>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field class="half-width">
                <mat-label>Quantity</mat-label>
                <input matInput type="number" formControlName="quantity" required min="1" 
                       [max]="selectedProduct?.stock || 1" (input)="calculateTotal()">
                <mat-error *ngIf="salesForm.get('quantity')?.hasError('required')">
                  Quantity is required
                </mat-error>
                <mat-error *ngIf="salesForm.get('quantity')?.hasError('min')">
                  Quantity must be at least 1
                </mat-error>
                <mat-error *ngIf="salesForm.get('quantity')?.hasError('max')">
                  Not enough stock available
                </mat-error>
              </mat-form-field>

              <div class="total-display" *ngIf="totalAmount > 0">
                <h3>Total Amount: \${{ totalAmount | number:'1.2-2' }}</h3>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="salesForm.invalid || isLoading || !selectedProduct">
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span *ngIf="!isLoading">Complete Sale</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .sales-form-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: center;
    }

    .half-width {
      flex: 1;
    }

    .product-info {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
      flex: 1;
    }

    .product-info h3 {
      margin: 0 0 8px 0;
      color: #3f51b5;
    }

    .product-info p {
      margin: 4px 0;
      color: #666;
    }

    .total-display {
      padding: 16px;
      background-color: #e8f5e8;
      border-radius: 4px;
      text-align: center;
      flex: 1;
    }

    .total-display h3 {
      margin: 0;
      color: #4caf50;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding-top: 24px;
    }
  `]
})
export class SalesFormComponent implements OnInit {
  salesForm: FormGroup;
  isLoading = false;
  availableProducts$: Observable<Product[]>;
  selectedProduct: Product | null = null;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private salesService: SalesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.salesForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.availableProducts$ = this.productService.getProducts().pipe(
      map(products => products.filter(p => p.stock > 0))
    );
  }

  ngOnInit(): void {}

  onProductChange(): void {
    const productId = this.salesForm.get('productId')?.value;
    if (productId) {
      this.productService.getProduct(productId).subscribe(product => {
        this.selectedProduct = product || null;
        this.updateQuantityValidators();
        this.calculateTotal();
      });
    }
  }

  updateQuantityValidators(): void {
    const quantityControl = this.salesForm.get('quantity');
    if (quantityControl && this.selectedProduct) {
      quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.selectedProduct.stock)
      ]);
      quantityControl.updateValueAndValidity();
    }
  }

  calculateTotal(): void {
    const quantity = this.salesForm.get('quantity')?.value || 0;
    if (this.selectedProduct && quantity > 0) {
      this.totalAmount = this.selectedProduct.price * quantity;
    } else {
      this.totalAmount = 0;
    }
  }

  onSubmit(): void {
    if (this.salesForm.valid && this.selectedProduct) {
      this.isLoading = true;

      const saleData = {
        productId: this.salesForm.get('productId')?.value,
        quantity: this.salesForm.get('quantity')?.value
      };

      this.salesService.createSale(saleData).subscribe({
        next: (sale) => {
          this.isLoading = false;
          this.snackBar.open(`Sale completed successfully! Total: $${sale.totalAmount.toFixed(2)}`, 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/sales']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message || 'Error completing sale', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/sales']);
  }
}