import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, map, tap, catchError } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:5000/api/products'; // ✅ Your API base

  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts(); // Load on startup
  }

  // 🔄 Load and update observable
  loadProducts(): void {
    this.http.get<Product[]>(this.baseUrl)
      .pipe(catchError(() => of([])))
      .subscribe(products => this.productsSubject.next(products));
  }

  // ✅ GET all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // ✅ GET product by _id
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // ✅ CREATE product
  createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(
      tap(() => this.loadProducts())
    );
  }

  // ✅ UPDATE product
  updateProduct(product: Product): Observable<Product> {
    const updated = { ...product, updatedAt: new Date() };
    return this.http.put<Product>(`${this.baseUrl}/${product._id}`, updated).pipe(
      tap(() => this.loadProducts())
    );
  }

  // ✅ DELETE product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadProducts())
    );
  }

  // ✅ Decrease stock after sale
  updateStock(productId: string, quantity: number): Observable<Product> {
    return this.getProduct(productId).pipe(
      map(product => ({
        ...product,
        stock: product.stock - quantity,
        updatedAt: new Date()
      })),
      switchMap(updated => this.updateProduct(updated))
    );
  }

  // 🔁 Optional dummy fallback
  getAllProducts(): Observable<Product[]> {
    return of([
      {
        _id: 'dummy1',
        name: 'Item A',
        stock: 10,
        price: 100,
        category: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }
}
