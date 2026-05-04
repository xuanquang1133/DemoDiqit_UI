// src/layouts/CmsLayout.tsx
import { Outlet } from 'react-router';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import '../components/layout/cms.css';

export default function CmsLayout() {
  return (
    <div>
      {/* Thanh header cố định trên cùng */}
      <Topbar />

      {/* Sidebar + nội dung trang nằm cạnh nhau */}
      <div className="cms-body">
        <Sidebar />
        <main className="cms-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}