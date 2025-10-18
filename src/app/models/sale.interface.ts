export interface Sale {
  _id?: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: Date;
}

export interface CreateSaleRequest {
  productId: number;
  quantity: number;
}