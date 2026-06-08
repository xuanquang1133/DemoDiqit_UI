import type { Order } from "../../../types/order";
import { DetailIcon } from "../../../components/icons";

interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function OrderTable({
  orders,
  onViewDetail,
}: OrderTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="whitespace-nowrap">
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                Order ID
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                Customer
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 hidden md:table-cell">
                Items
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                Total
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                Status
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                Date
              </th>
              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-900">
                    {order.order_number}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden sm:table-cell">
                    <div className="min-w-0 max-w-[120px] sm:max-w-[200px]">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                        {order.customer_name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden md:block">
                        {order.customer_email}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm text-slate-600 hidden md:table-cell">
                    {order.items_count}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-medium text-slate-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 hidden lg:table-cell">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium ${
                        statusStyles[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-600 hidden lg:table-cell">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm">
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewDetail(order); }}
                      className="rounded-lg p-1.5 sm:p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                      title="View Detail"
                    >
                      <DetailIcon size={14} className="sm:!hidden" />
                      <DetailIcon size={16} className="hidden sm:block" />
                    </button>
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
