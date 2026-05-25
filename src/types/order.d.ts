// Order status types
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// OrderItem represents a single item in an order
export interface OrderItem {
  id: number;
  product_id?: number | null;
  product_name: string;
  product_thumbnail: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Order represents an order entity
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
  items_count: number;
  order_items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

// OrderDetail extends Order with full items
export interface OrderDetail extends Order {
  order_items: OrderItem[];
}

// Query parameters for order listing
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

// API response types
export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Request types
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// API error response
export interface ApiErrorResponse {
  code: string;
  message: string;
}
