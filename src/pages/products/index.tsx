import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { ProductTable } from "./components/ProductTable";
import { ProductPagination } from "./components/ProductPagination";
import { DeleteModal } from "./components/DeleteModal";
import type { Product, ProductQueryParams } from "../../types/product";
import { SearchIcon, SpinnerIcon } from "../../components/icons";
import { getProducts, deleteProduct, updateProductStatus } from "../../api/product";

// Hook logic inlined into component
interface UseProductListOptions {
  initialPage?: number;
  initialLimit?: number;
}

function useProductList(options: UseProductListOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: ProductQueryParams = { page, limit };
      if (keyword) {
        params.keyword = keyword;
      }
      const response = await getProducts(params);
      setProducts(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [page, limit, keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = useCallback(async (product: Product) => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      fetchProducts();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [fetchProducts]);

  const handleToggleStatus = useCallback(async (product: Product) => {
    try {
      await updateProductStatus(product.id, !product.is_active);
      fetchProducts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to update status");
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    keyword,
    fetchProducts,
    handleDelete,
    handleToggleStatus,
    setPage,
    setLimit,
    setKeyword,
    setSearchInput,
    searchInput,
    isDeleting,
  };
}

export default function ProductListPage() {
  const navigate = useNavigate();

  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    searchInput,
    setSearchInput,
    handleDelete: deleteProduct,
    handleToggleStatus,
    setPage,
    isDeleting,
  } = useProductList();

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    product: Product | null;
  }>({
    show: false,
    product: null,
  });

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleViewDetail = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({ show: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return;
    try {
      await deleteProduct(deleteModal.product);
      setDeleteModal({ show: false, product: null });
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleToggleStatusClick = (product: Product) => {
    handleToggleStatus(product).catch((err: Error) => {
      alert(err.message);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <button
          onClick={() => navigate("/products/create")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <SpinnerIcon className="h-8 w-8 text-blue-600" />
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatusClick}
            onViewDetail={handleViewDetail}
            isLoading={loading}
          />

          <ProductPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.product && (
        <DeleteModal
          product={deleteModal.product}
          isOpen={deleteModal.show}
          isDeleting={isDeleting}
          onClose={() => setDeleteModal({ show: false, product: null })}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
