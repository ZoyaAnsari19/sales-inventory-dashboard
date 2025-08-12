// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, of, switchMap, map, tap, catchError } from 'rxjs';
// import { Product } from '../models/product.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   private baseUrl = 'http://localhost:5000/api/products'; // ✅ Your API base

//   private productsSubject = new BehaviorSubject<Product[]>([]);
//   public products$ = this.productsSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadProducts(); // Load on startup
//   }

//   // 🔄 Load and update observable
//   loadProducts(): void {
//     this.http.get<any[]>(this.baseUrl)
//       .pipe(
//         map(products =>
//           products.map(p => ({
//             ...p,
//             productName: p.productName ?? p.prouctName // ✅ Fix typo if exists
//           }))
//         ),
//         catchError(() => of([]))
//       )
//       .subscribe(products => this.productsSubject.next(products));
//   }

//   // ✅ GET all products
//   getProducts(): Observable<Product[]> {
//     return this.http.get<any[]>(this.baseUrl).pipe(
//       map(products =>
//         products.map(p => ({
//           ...p,
//           productName: p.productName ?? p.prouctName // ✅ Fix typo if exists
//         }))
//       )
//     );
//   }

//   // ✅ GET product by _id
//   getProduct(id: string): Observable<Product> {
//     return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
//       map(p => ({
//         ...p,
//         productName: p.productName ?? p.prouctName // ✅ Fix typo if exists
//       }))
//     );
//   }

//   // ✅ CREATE product
//   createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
//     const newProduct = {
//       ...product,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };
//     return this.http.post<Product>(this.baseUrl, newProduct).pipe(
//       tap(() => this.loadProducts())
//     );
//   }

//   // ✅ UPDATE product
//   updateProduct(product: Product): Observable<Product> {
//     const updated = { ...product, updatedAt: new Date() };
//     return this.http.put<Product>(`${this.baseUrl}/${product._id}`, updated).pipe(
//       tap(() => this.loadProducts())
//     );
//   }

//   // ✅ DELETE product
//   deleteProduct(id: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/${id}`).pipe(
//       tap(() => this.loadProducts())
//     );
//   }

//   // ✅ Decrease stock after sale
//   updateStock(productId: string, quantity: number): Observable<Product> {
//     return this.getProduct(productId).pipe(
//       map(product => ({
//         ...product,
//         stock: product.stock - quantity,
//         updatedAt: new Date()
//       })),
//       switchMap(updated => this.updateProduct(updated))
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, map, tap, catchError } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/products';

  // Keep BehaviorSubject so components can get latest value quickly
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  // Load and normalize server response
  loadProducts(): void {
    this.http.get<any[]>(this.baseUrl).pipe(
      map(products =>
        (products || []).map(p => this.normalize(p))
      ),
      catchError(err => {
        console.error('Load products error', err);
        return of([]);
      })
    ).subscribe(products => this.productsSubject.next(products));
  }

  // GET all (returns normalized Product[])
  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(products => (products || []).map(p => this.normalize(p)))
    );
  }

  // GET by id
  getProduct(id: string): Observable<Product> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(p => this.normalize(p))
    );
  }

  // CREATE product
  createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const payload = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.http.post<any>(this.baseUrl, payload).pipe(
      map(p => this.normalize(p)),
      tap(() => this.loadProducts())
    );
  }

  // UPDATE product
  updateProduct(product: Product): Observable<Product> {
    const updated = { ...product, updatedAt: new Date() };
    return this.http.put<any>(`${this.baseUrl}/${product._id}`, updated).pipe(
      map(p => this.normalize(p)),
      tap(() => this.loadProducts())
    );
  }

  // DELETE product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadProducts())
    );
  }

  // Update stock
  updateStock(productId: string, quantity: number): Observable<Product> {
    return this.getProduct(productId).pipe(
      switchMap(product => {
        const updated: Product = {
          ...product,
          stock: (product.stock ?? 0) - quantity,
          updatedAt: new Date()
        };
        return this.updateProduct(updated);
      })
    );
  }

  // helper to normalize backend object
  private normalize(p: any): Product {
    return {
      _id: p._id ?? p.id ?? '',
      productName: p.productName ?? p.prouctName ?? '',
      description: p.description ?? '',
      category: p.category ?? '',
      stock: (p.stock ?? p.quantityInStock ?? 0),
      price: (p.price ?? 0),
      createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined
    } as Product;
  }
}
