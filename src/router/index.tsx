import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../components/layouts/AuthLayout";
import CmsLayout from "../components/layouts/CmsLayout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import NotFoundPage from "../pages/not-found";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import UserListPage from "../pages/users/index";
import CreateUserPage from "../pages/users/create";
import UpdateUserPage from "../pages/users/update";

import CategoryListPage from "../pages/categories/index";
import CreateCategoryPage from "../pages/categories/create";
import UpdateCategoryPage from "../pages/categories/update";

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
            path: "/users",
            element: <UserListPage />,
          },
          {
            path: "/users/create",
            element: <CreateUserPage />,
          },
          {
            path: "/users/update/:id",
            element: <UpdateUserPage />,
          },
          {
            path: "/categories",
            element: <CategoryListPage />,
          },
          {
            path: "/categories/create",
            element: <CreateCategoryPage />,
          },
          {
            path: "/categories/update/:id",
            element: <UpdateCategoryPage />,
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