

export interface Product {
  _id?: string;
  productName: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

