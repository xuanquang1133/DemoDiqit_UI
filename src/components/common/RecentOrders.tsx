import { useNavigate } from "react-router";
import { ShoppingCartIcon, SpinnerIcon } from "../icons";
import type { RecentOrderItem } from "../../types/dashboard";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

function getStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending:    { bg: "bg-amber-50",  text: "text-amber-700",  label: "Pending"    },
    processing: { bg: "bg-blue-50",   text: "text-blue-700",   label: "Processing" },
    completed:  { bg: "bg-green-50",  text: "text-green-700",  label: "Completed"  },
    cancelled:  { bg: "bg-red-50",    text: "text-red-700",    label: "Cancelled"  },
  };
  const s = map[status] ?? { bg: "bg-slate-50", text: "text-slate-600", label: status };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

interface RecentOrdersProps {
  orders: RecentOrderItem[];
  loading?: boolean;
}

export function RecentOrders({ orders, loading = false }: RecentOrdersProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
        <h2 className="text-sm sm:text-base font-semibold text-slate-800">Recent Orders</h2>
        <button
          onClick={() => navigate("/orders")}
          className="text-[11px] sm:text-xs font-medium text-rose-500 transition-colors hover:text-rose-600"
        >
          View all →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50">
              <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Order ID
              </th>
              <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                Customer
              </th>
              <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                Product
              </th>
              <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Amount
              </th>
              <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 sm:py-12">
                  <div className="flex items-center justify-center">
                    <SpinnerIcon className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-slate-300" />
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 sm:py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-300">
                    <ShoppingCartIcon size={28} className="sm:hidden" />
                    <ShoppingCartIcon size={36} className="hidden sm:block" />
                    <span className="text-xs sm:text-sm text-slate-400">No orders yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.order_number}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => navigate(`/orders/${order.order_number}`)}
                >
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-700">
                    #{order.order_number}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600 hidden sm:table-cell">
                    {order.customer_name}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-500 hidden md:table-cell">
                    {order.product_name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-medium text-slate-700">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
