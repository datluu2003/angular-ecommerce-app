export interface OrderItemType {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderType {
  _id?: string;
  orderNumber?: string;
  items: OrderItemType[];
  orderStatus?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  address?: string;
  phone?: string;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}
