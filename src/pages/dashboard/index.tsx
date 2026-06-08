import { useState, useEffect } from "react";
import { RevenueChart } from "../../components/common/RevenueChart";
import { RecentOrders } from "../../components/common/RecentOrders";
import { StatsOverview } from "../../components/common/StatsOverview";
import { dashboardApi } from "../../api/dashboard";
import type {
  DashboardData,
  DashboardStats,
} from "../../types/dashboard";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<import("../../types/dashboard").RecentOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await dashboardApi.getStats();
        const data: DashboardData = res.data;
        setStats(data.stats);
        setRecentOrders(data.recent_orders);
      } catch (err: unknown) {
        console.error("Failed to load dashboard", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const greeting = user?.full_name
    ? `Welcome back, ${user.full_name.split(" ")[0]}!`
    : "Welcome back, Admin!";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">{greeting}</p>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Stat Cards (4 columns) ─────────────────── */}
      <StatsOverview stats={stats} loading={loading} />

      {/* ── Revenue Chart ─────────────────────────── */}
      <RevenueChart />

      {/* ── Recent Orders ─────────────────────────── */}
      <RecentOrders orders={recentOrders} loading={loading} />
    </div>
  );
}
