import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { OrderTable } from "./components/OrderTable";
import { Pagination } from "../../components/common/Pagination";
import { FilterBar } from "../../components/common/FilterBar";
import { Select } from "../../components/common/Select";
import { usePaginationHistory } from "../../hooks/usePaginationHistory";
import type { Order, OrderQueryParams } from "../../types/order";
import { getOrders } from "../../api/order";
import { ORDER_STATUS_FILTER_OPTIONS } from "../../constants";

export default function OrderListPage() {
  const [, setSearchParams] = useSearchParams();

  const { page, setPage } = usePaginationHistory({ scope: "orders" });
  const limit = 10;

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "All",
  });

  const [searchInput, setSearchInput] = useState("");

  const totalPages = Math.ceil(total / limit);

  const buildParams = useCallback((): OrderQueryParams => {
    const params: OrderQueryParams = { page, limit };
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.status !== "All") params.status = filters.status;
    return params;
  }, [page, limit, filters.keyword, filters.status]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getOrders(buildParams());
      setOrders(response.items);
      setTotal(response.total);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.keyword === searchInput) return prev;
        return { ...prev, keyword: searchInput };
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams((prev) => {
      if (newPage === 1) {
        prev.delete("page");
        return prev;
      }
      prev.set("page", String(newPage));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (setter: (prev: typeof filters) => typeof filters) => {
    setFilters(setter);
    setPage(1);
    setSearchParams((prev) => {
      prev.delete("page");
      return prev;
    });
  };

  const handleViewDetail = (order: Order) => {
    window.location.href = `/orders/${order.id}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage orders from customers</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search order ID / customer..."
      >
        <Select
          value={filters.status}
          onChange={(e) =>
            handleFilterChange((prev) => ({ ...prev, status: e.target.value }))
          }
          options={ORDER_STATUS_FILTER_OPTIONS}
        />
      </FilterBar>

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        onViewDetail={handleViewDetail}
      />

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
