import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import ProductForm from "../../components/products/ProductForm";
import type { Product } from "../../types/product";
import { getProduct } from "../../api/product";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProduct(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSuccess = () => {
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center py-16">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-slate-50 p-6 text-center">
          <p className="mb-4 text-sm text-slate-600">Product not found</p>
          <button
            onClick={() => navigate("/products")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ProductForm
        mode="edit"
        initialData={product}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
