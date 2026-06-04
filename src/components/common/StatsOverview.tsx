import { UserGroupIcon, PackageIcon, ShoppingCartIcon, TrendingUpIcon, SpinnerIcon } from "../icons";
import type { DashboardStats } from "../../types/dashboard";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + "B";
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
  if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
  return amount.toLocaleString("vi-VN");
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

interface StatCardProps {
  label: string;
  value: string;
  valueColor: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
}

function StatCard({ label, value, valueColor, icon, iconBg, iconColor, isLoading }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
          {isLoading ? (
            <SpinnerIcon className="h-8 w-8 animate-spin text-slate-300" />
          ) : (
            <span
              className="text-[28px] font-bold leading-none tracking-tight"
              style={{ color: valueColor }}
            >
              {value}
            </span>
          )}
        </div>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export function StatsOverview({ stats, loading = false }: StatsOverviewProps) {
  const statCards = [
    {
      label: "TOTAL USERS",
      value: stats ? formatCurrency(stats.total_users) : "--",
      valueColor: "#2563eb",
      icon: <UserGroupIcon size={20} />,
      iconBg: "#dbeafe",
      iconColor: "#2563eb",
    },
    {
      label: "PRODUCTS",
      value: stats ? formatCurrency(stats.total_products) : "--",
      valueColor: "#16a34a",
      icon: <PackageIcon size={20} />,
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      label: "COMPLETED ORDERS",
      value: stats ? formatCurrency(stats.completed_orders) : "--",
      valueColor: "#d97706",
      icon: <ShoppingCartIcon size={20} />,
      iconBg: "#fef3c7",
      iconColor: "#d97706",
    },
    {
      label: "REVENUE",
      value: stats ? formatPrice(stats.total_revenue) : "--",
      valueColor: "#dc2626",
      icon: <TrendingUpIcon size={20} />,
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          valueColor={card.valueColor}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          isLoading={loading}
        />
      ))}
    </div>
  );
}
