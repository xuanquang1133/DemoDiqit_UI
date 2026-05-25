import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../components/icons";
import { createOrder } from "../../api/order";
import { CustomButton } from "../../components/common/CustomButton";
import { CancelButton } from "../../components/common/CancelButton";
import type { Product } from "../../types/product";
import { getProducts } from "../../api/product";
import toast from "react-hot-toast";

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_fee: "30000",
    notes: "",
  });

  const [items, setItems] = useState<{ product_id: number; quantity: number }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ limit: 100 });
        setProducts(res.items.filter((p) => p.is_active));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (products.length > 0) {
      setItems([...items, { product_id: products[0].id, quantity: 1 }]);
    }
  };

  const updateItem = (index: number, field: "product_id" | "quantity", value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + Number(formData.shipping_fee || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.shipping_address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        ...formData,
        shipping_fee: Number(formData.shipping_fee),
        items,
      });
      toast.success("Order created successfully");
      navigate("/orders");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        > 
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left - Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Customer Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Shipping Fee
                </label>
                <input
                  type="number"
                  name="shipping_fee"
                  value={formData.shipping_fee}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Shipping Address *
              </label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Order Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">
                No items added. Click "Add Item" to add products.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const product = products.find((p) => p.id === item.product_id);
                  return (
                    <div key={index} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                      <select
                        value={item.product_id}
                        onChange={(e) => updateItem(index, "product_id", Number(e.target.value))}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {formatCurrency(p.price)}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                          className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <span className="min-w-[100px] text-right text-sm font-medium">
                        {formatCurrency(product ? Number(product.price) * item.quantity : 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right - Summary */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">{formatCurrency(Number(formData.shipping_fee || 0))}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="text-red-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <CustomButton
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Order"}
              </CustomButton>
              <CancelButton onCancel={() => navigate("/orders")} disabled={isSubmitting} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
