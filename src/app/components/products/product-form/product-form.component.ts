import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
  <div class="container mt-4">
    <mat-card>
      <h5 class="mb-3">{{ isEditMode ? '✏️ Edit Product' : '➕ Add Product' }}</h5>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label>Name</label>
          <input class="form-control" formControlName="name" />
        </div>
        <div class="mb-3">
          <label>Category</label>
          <input class="form-control" formControlName="category" />
        </div>
        <div class="mb-3">
          <label>Stock</label>
          <input type="number" class="form-control" formControlName="stock" />
        </div>
        <div class="mb-3">
          <label>Price (₹)</label>
          <input type="number" class="form-control" formControlName="price" />
        </div>
        <button type="submit" class="btn btn-primary me-2" [disabled]="productForm.invalid">
          {{ isEditMode ? 'Update' : 'Add' }}
        </button>
        <a routerLink="/products" class="btn btn-secondary">Cancel</a>
      </form>
    </mat-card>
  </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string = ''; // ✅ Now a string for MongoDB _id

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;

      this.productService.getProduct(this.productId).subscribe(product => {
        if (product) {
          this.productForm.patchValue(product);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      if (this.isEditMode) {
        const updatedProduct: Product = {
          ...formValue,
          _id: this.productId, // ✅ Use MongoDB _id
          updatedAt: new Date(),
          createdAt: new Date() // Optional: Replace with actual from DB if needed
        };

        this.productService.updateProduct(updatedProduct).subscribe(() => {
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        });
      } else {
        const newProduct: Product = {
          ...formValue,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.productService.createProduct(newProduct).subscribe(() => {
          this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        });
      }
    }
  }
}
