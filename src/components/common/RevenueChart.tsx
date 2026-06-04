import { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUpIcon, SpinnerIcon } from "../icons";
import { dashboardApi } from "../../api/dashboard";
import type { DailyRevenue, PeriodFilter, ChartQueryParams } from "../../types/dashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const FILTER_BUTTONS: { label: string; value: PeriodFilter }[] = [
  { label: "7 Days",   value: "7d"  },
  { label: "1 Month", value: "1m"  },
  { label: "3 Months", value: "3m"  },
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function formatPeriodLabel(period: PeriodFilter): string {
  switch (period) {
    case "7d":    return "Last 7 Days";
    case "1m":    return "Last 1 Month";
    case "3m":    return "Last 3 Months";
    case "custom": return "Custom Period";
  }
}

interface RevenueChartProps {
  className?: string;
}

export function RevenueChart({ className = "" }: RevenueChartProps) {
  const [period, setPeriod] = useState<PeriodFilter>("1m");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const [chartData, setChartData] = useState<DailyRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    const params: ChartQueryParams = { period };
    if (period === "custom") {
      if (!customFrom || !customTo) return;
      params.date_from = customFrom;
      params.date_to = customTo;
    }

    setLoading(true);
    setFetchError(null);
    try {
      const res = await dashboardApi.getChart(params);
      setChartData(res.data.items);
      setTotalRevenue(res.data.total);
      setTotalOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to load chart", err);
      setFetchError("Failed to load chart data.");
    } finally {
      setLoading(false);
    }
  }, [period, customFrom, customTo]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const handleFilterClick = (val: PeriodFilter) => {
    if (val === "custom") {
      setShowCustom(true);
      setPeriod("custom");
    } else {
      setShowCustom(false);
      setPeriod(val);
    }
  };

  const handleCustomApply = () => {
    if (customFrom && customTo && customFrom <= customTo) {
      setPeriod("custom");
    }
  };

  const labels = chartData.map((d) => formatDateLabel(d.date));
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: chartData.map((d) => d.amount),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244,63,94,0.08)",
        borderWidth: 2.5,
        pointRadius: chartData.length > 60 ? 0 : 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#f43f5e",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#f8fafc",
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 11, weight: "bold" as const },
        bodyFont: { size: 13, weight: "bold" as const },
        callbacks: {
          label: (ctx) => `  ${formatPrice(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          maxTicksLimit: chartData.length > 60 ? 8 : chartData.length,
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          callback: (value) => {
            const v = Number(value);
            if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B";
            if (v >= 1_000_000)     return (v / 1_000_000).toFixed(1) + "M";
            if (v >= 1_000)          return (v / 1_000).toFixed(0) + "K";
            return v;
          },
        },
        suggestedMax: maxAmount > 0 ? maxAmount * 1.2 : 1,
      },
    },
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-slate-800">Revenue Overview</h2>
          <p className="text-xs text-slate-400">{formatPeriodLabel(period)} · Completed orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5">
          {FILTER_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleFilterClick(btn.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                period === btn.value && !showCustom
                  ? "bg-rose-50 text-rose-600 font-semibold"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={() => handleFilterClick("custom")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              showCustom || period === "custom"
                ? "bg-rose-50 text-rose-600 font-semibold"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-8 border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <TrendingUpIcon size={14} className="text-rose-500" />
          <span className="text-[11px] text-slate-400">Total Revenue</span>
          {loading ? (
            <SpinnerIcon size={12} className="animate-spin text-slate-300" />
          ) : (
            <span className="text-sm font-bold text-slate-800">{formatPrice(totalRevenue)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Orders</span>
          {loading ? (
            <SpinnerIcon size={12} className="animate-spin text-slate-300" />
          ) : (
            <span className="text-sm font-bold text-slate-800">{totalOrders.toLocaleString("vi-VN")}</span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex h-52 items-center justify-center">
            <SpinnerIcon size={28} className="animate-spin text-slate-300" />
          </div>
        ) : fetchError ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-red-400">
            <TrendingUpIcon size={40} />
            <span className="text-sm">{fetchError}</span>
          </div>
        ) : chartData.every((d) => d.amount === 0) ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-slate-300">
            <TrendingUpIcon size={40} />
            <span className="text-sm text-slate-400">No revenue data in this period</span>
          </div>
        ) : (
          <div className="relative h-52">
            <Line data={data} options={options} />
          </div>
        )}
      </div>

      {/* Custom Date Range */}
      {showCustom && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3">
          <label className="text-xs text-slate-500">From</label>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition-colors focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-200"
          />
          <label className="text-xs text-slate-500">To</label>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition-colors focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-200"
          />
          <button
            onClick={handleCustomApply}
            disabled={!customFrom || !customTo || customFrom > customTo}
            className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply
          </button>
          {customFrom && customTo && customFrom > customTo && (
            <span className="text-xs text-red-500">Start must be before end date</span>
          )}
        </div>
      )}
    </div>
  );
}
