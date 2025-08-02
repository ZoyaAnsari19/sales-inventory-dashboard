import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { Sale } from '../models/sale.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  // ✅ Export Products to CSV
  exportProductsToCSV(products: Product[]): void {
    const headers = ['ID', 'Name', 'Category', 'Stock', 'Price', 'Description', 'Created At', 'Updated At'];
    const csvContent = this.convertToCSV(products, headers, (product: Product) => [
      product._id ?? '',                                 // Use nullish coalescing to avoid undefined
      product.name,
      product.category,
      product.stock.toString(),
      product.price.toString(),
      product.description || '',
      product.createdAt ? product.createdAt.toISOString() : '',
      product.updatedAt ? product.updatedAt.toISOString() : ''
    ]);

    this.downloadCSV(csvContent, 'products.csv');
  }

  // ✅ Export Sales to CSV
  exportSalesToCSV(sales: Sale[]): void {
    const headers = ['ID', 'Product Name', 'Quantity', 'Unit Price', 'Total Amount', 'Sale Date'];
    const csvContent = this.convertToCSV(sales, headers, (sale: Sale) => [
      sale._id ?? '',                                     // Changed from sale.id → sale._id for MongoDB
      sale.productName,
      sale.quantity.toString(),
      sale.unitPrice.toString(),
      sale.totalAmount.toString(),
      sale.saleDate ? new Date(sale.saleDate).toISOString() : ''
    ]);

    this.downloadCSV(csvContent, 'sales.csv');
  }

  // 🔁 Converts array of objects into CSV string
  private convertToCSV<T>(data: T[], headers: string[], rowMapper: (item: T) => string[]): string {
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add each item row
    for (const item of data) {
      const row = rowMapper(item).map(field => `"${field}"`);
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }

  // ⬇️ Triggers CSV file download in browser
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
    }
  }
}
