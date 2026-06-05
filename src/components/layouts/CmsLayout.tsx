import { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function CmsLayout() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme") || "indigo";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
