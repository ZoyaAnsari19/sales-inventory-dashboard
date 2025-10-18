// import { Injectable } from '@angular/core';
// import { Product } from '../models/product.interface';
// import { Sale } from '../models/sale.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class ExportService {

//   // ✅ Export Products to CSV
//   exportProductsToCSV(products: Product[]): void {
//     const headers = ['ID', 'Name', 'Category', 'Stock', 'Price', 'Description', 'Created At', 'Updated At'];
//     const csvContent = this.convertToCSV(products, headers, (product: Product) => [
//       product._id ?? '',                                 // Use nullish coalescing to avoid undefined
//       product.productName,
//       product.category,
//       product.stock.toString(),
//       product.price.toString(),
//       product.description || '',
//       product.createdAt ? product.createdAt.toISOString() : '',
//       product.updatedAt ? product.updatedAt.toISOString() : ''
//     ]);

//     this.downloadCSV(csvContent, 'products.csv');
//   }

//   // ✅ Export Sales to CSV
//   exportSalesToCSV(sales: Sale[]): void {
//     const headers = ['ID', 'Product Name', 'Quantity', 'Unit Price', 'Total Amount', 'Sale Date'];
//     const csvContent = this.convertToCSV(sales, headers, (sale: Sale) => [
//       sale._id ?? '',                                     // Changed from sale.id → sale._id for MongoDB
//       sale.productName,
//       sale.quantity.toString(),
//       sale.unitPrice.toString(),
//       sale.totalAmount.toString(),
//       sale.saleDate ? new Date(sale.saleDate).toISOString() : ''
//     ]);

//     this.downloadCSV(csvContent, 'sales.csv');
//   }

//   // 🔁 Converts array of objects into CSV string
//   private convertToCSV<T>(data: T[], headers: string[], rowMapper: (item: T) => string[]): string {
//     const csvRows = [];

//     // Add header row
//     csvRows.push(headers.join(','));

//     // Add each item row
//     for (const item of data) {
//       const row = rowMapper(item).map(field => `"${field}"`);
//       csvRows.push(row.join(','));
//     }

//     return csvRows.join('\n');
//   }

//   // ⬇️ Triggers CSV file download in browser
//   private downloadCSV(csvContent: string, filename: string): void {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');

//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { Sale } from '../models/sale.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  // Add BOM so Excel recognizes UTF-8 & ₹ symbol correctly
  private BOM = '\uFEFF';

  exportProductsToCSV(products: Product[], filename = 'products.csv'): void {
    if (!products || products.length === 0) {
      return;
    }

    const headers = ['ID', 'Name', 'Category', 'Stock', 'Price', 'Description', 'Created At', 'Updated At'];

    const rows = products.map(p => {
      const created = p.createdAt ? new Date(p.createdAt).toISOString() : '';
      const updated = p.updatedAt ? new Date(p.updatedAt).toISOString() : '';
      return [
        this.safe(p._id),
        this.safe(p.productName),
        this.safe(p.category),
        this.safe(p.stock?.toString() ?? '0'),
        this.safe(p.price?.toString() ?? '0'),
        this.safe(p.description ?? ''),
        this.safe(created),
        this.safe(updated)
      ];
    });

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    this.downloadCSV(this.BOM + csv, filename);
  }

  exportSalesToCSV(sales: Sale[], filename = 'sales.csv'): void {
    if (!sales || sales.length === 0) return;

    const headers = ['ID', 'Product Name', 'Quantity', 'Unit Price', 'Total Amount', 'Sale Date'];

    const rows = sales.map(s => [
      this.safe(s._id),
      this.safe(s.productName),
      this.safe((s.quantity ?? '').toString()),
      this.safe((s.unitPrice ?? '').toString()),
      this.safe((s.totalAmount ?? '').toString()),
      this.safe(s.saleDate ? new Date(s.saleDate).toISOString() : '')
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    this.downloadCSV(this.BOM + csv, filename);
  }

  // wrap and escape double quotes inside fields
  private safe(field: any): string {
    if (field === null || field === undefined) return '';
    const str = String(field);
    // Escape existing double quotes by doubling them, and wrap in double quotes
    return `"${str.replace(/"/g, '""')}"`;
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
