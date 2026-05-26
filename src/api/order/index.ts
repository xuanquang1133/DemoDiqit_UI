import axiosClient from "../axiosClient";
import type {
  Order,
  OrderDetail,
  OrderQueryParams,
  OrderListResponse,
} from "../../types/order";

// Fetch paginated list of orders with optional filters
export const getOrders = async (params?: OrderQueryParams): Promise<OrderListResponse> => {
  return axiosClient.get<any, OrderListResponse>("/orders", { params });
};

// Fetch a single order by ID with full details
export const getOrder = async (id: number): Promise<OrderDetail> => {
  return axiosClient.get<any, OrderDetail>(`/orders/${id}`);
};

// Update order status
export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const payload = { status };
  return axiosClient.patch<any, Order>(`/orders/${id}/status`, payload);
};

// Create a new order
export const createOrder = async (data: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_fee: number;
  notes?: string;
  items: { product_id: number; quantity: number }[];
}): Promise<Order> => {
  return axiosClient.post<any, Order>("/orders", data);
};
