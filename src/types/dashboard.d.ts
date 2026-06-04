// ── Dashboard Stats (GET /dashboard) ──────────────────────────

export interface DashboardStats {
  total_users: number;
  total_products: number;
  completed_orders: number;
  total_revenue: number;
}

export interface RecentOrderItem {
  order_number: string;
  customer_name: string;
  product_name: string;
  total_amount: number;
  status: string;
}

export interface MonthlyRevenue {
  month: string; // "YYYY-MM"
  amount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_orders: RecentOrderItem[];
  monthly_revenue: MonthlyRevenue[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// ── Dashboard Chart (GET /dashboard/v2/chart) ──────────────────

export interface DashboardChartData {
  items: DailyRevenue[];
  total: number;
  orders: number;
}

export type PeriodFilter = "7d" | "1m" | "3m" | "custom";

export interface DailyRevenue {
  date: string;   // "YYYY-MM-DD"
  amount: number; // Revenue in VND
}

export interface ChartQueryParams {
  period: PeriodFilter;
  date_from?: string; // "YYYY-MM-DD"
  date_to?: string;   // "YYYY-MM-DD"
}
