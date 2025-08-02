

export interface Product {
  _id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

