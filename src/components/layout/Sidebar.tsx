// src/components/layout/Sidebar.tsx
import { useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Package,
  ShoppingCart,
  LogOut,
} from '../icons';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboard size={18} />, path: '/cms/dashboard' },
  { label: 'Users',      icon: <Users size={18} />,           path: '/cms/users' },
  { label: 'Categories', icon: <FolderOpen size={18} />,      path: '/cms/categories' },
  { label: 'Products',   icon: <Package size={18} />,         path: '/cms/products' },
  { label: 'Orders',     icon: <ShoppingCart size={18} />,    path: '/cms/orders' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="cms-sidebar">
      <p className="cms-sidebar__section-label">Main Menu</p>
      <nav>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <div
              key={item.path}
              className={`nav-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="cms-sidebar__spacer" />
      <div className="cms-sidebar__divider" />

      {/* Logout */}
      <div
        className="nav-item"
        style={{ color: '#f87171' }}
        onClick={() => {
          localStorage.removeItem('access_token');
          navigate('/login');
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            localStorage.removeItem('access_token');
            navigate('/login');
          }
        }}
      >
        <span className="nav-icon"><LogOut size={18} /></span>
        Logout
      </div>
    </aside>
  );
}
