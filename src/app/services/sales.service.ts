import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Sale, CreateSaleRequest } from '../models/sale.interface';
import { TopProduct } from '../models/top-product.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5000/api/sales';

  constructor(private http: HttpClient) {}

  // ✅ Get all sales
  getSales(): Observable<Sale[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(sales =>
        sales.map(sale => ({
          id: sale._id,
          productId: sale.productId ?? null,
          productName: sale.productName ?? 'Unknown Product',
          quantity: sale.quantity ?? 0,
          unitPrice: sale.unitPrice,
          totalAmount: sale.totalAmount,
          saleDate: new Date(sale.saleDate)
        }))
      )
    );
  }

  // ✅ Create new sale
  createSale(sale: CreateSaleRequest): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, sale);
  }

  // ✅ Get sales by date range
  getSalesByDateRange(startDate: Date, endDate: Date): Observable<Sale[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    return this.http.get<any[]>(`${this.apiUrl}/range?start=${start}&end=${end}`).pipe(
      map(sales =>
        sales.map(sale => ({
          id: sale._id,
          productId: sale.productId ?? null,
          productName: sale.productName ?? 'Unknown Product',
          quantity: sale.quantity ?? 0,
          unitPrice: sale.unitPrice,
          totalAmount: sale.totalAmount,
          saleDate: new Date(sale.saleDate)
        }))
      )
    );
  }

  // ✅ Get top-selling products
  getTopSellingProducts(limit: number = 5): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/top-selling?limit=${limit}`);
  }

  // ✅ Get total sales
  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-sales`);
  }
}
