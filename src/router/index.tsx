import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout";
import CmsLayout from "../components/layouts/CmsLayout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import ProductListPage from "../pages/products";
import ProductCreatePage from "../pages/product-create";
import ProductDetailPage from "../pages/product-detail";
import ProductEditPage from "../pages/product-edit";
import NotFoundPage from "../pages/not-found";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CmsLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/products",
            element: <ProductListPage />,
          },
          {
            path: "/products/create",
            element: <ProductCreatePage />,
          },
          {
            path: "/products/:id",
            element: <ProductDetailPage />,
          },
          {
            path: "/products/:id/edit",
            element: <ProductEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
