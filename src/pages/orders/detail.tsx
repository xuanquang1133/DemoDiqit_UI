import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeftIcon, SpinnerIcon } from "../../components/icons";
import { Select } from "../../components/common/Select";
import { ORDER_STATUS_OPTIONS } from "../../constants";
import type { OrderDetail, OrderStatus } from "../../types/order";
import { getOrder, updateOrderStatus } from "../../api/order";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOrder(Number(id));
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    setIsUpdating(true);
    try {
      const updated = await updateOrderStatus(order.id, selectedStatus);
      setOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
      toast.success("Order status updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerIcon className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="mb-4 text-sm text-red-600">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-lg bg-slate-50 p-6 text-center">
        <p className="mb-4 text-sm text-slate-600">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order {order.order_number}</h1>
            <p className="text-sm text-slate-500">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            options={ORDER_STATUS_OPTIONS}
          />
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating || selectedStatus === order.status}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Order Items ({order.items_count})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-[500px] w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.product_thumbnail ? (
                            <img
                              src={item.product_thumbnail}
                              alt={item.product_name}
                              className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/40";
                              }}
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                              <span className="text-xs">No img</span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-slate-900">
                            {item.product_name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-slate-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 border-t border-slate-200 pt-4 text-right space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-slate-900">{formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-2">
                <span className="text-slate-900">Total</span>
                <span className="text-red-600">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-medium text-slate-500 uppercase tracking-wide">
              Status
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                statusStyles[order.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-medium text-slate-500 uppercase tracking-wide">
              Customer
            </h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-slate-900">{order.customer_name}</p>
              <p className="text-slate-600">{order.customer_email}</p>
              <p className="text-slate-600">{order.customer_phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-medium text-slate-500 uppercase tracking-wide">
              Shipping Address
            </h4>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {order.shipping_address}
            </p>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="mb-3 text-sm font-medium text-slate-500 uppercase tracking-wide">
                Notes
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
