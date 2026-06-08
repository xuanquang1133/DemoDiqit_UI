
import { useLocation, useNavigate } from 'react-router';
import { LayoutDashboardIcon } from '../icons/LayoutDashboardIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { FolderOpenIcon } from '../icons/FolderOpenIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { LogOutIcon } from '../icons/LogOutIcon';

import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboardIcon size={18} />, path: '/dashboard' },
  { label: 'Users',      icon: <UserGroupIcon size={18} />,           path: '/users' },
  { label: 'Categories', icon: <FolderOpenIcon size={18} />,      path: '/categories' },
  { label: 'Products',   icon: <PackageIcon size={18} />,         path: '/products' },
  { label: 'Orders',     icon: <ShoppingCartIcon size={18} />,    path: '/orders' },
  { label: 'Settings',   icon: <SettingsIcon size={18} />,        path: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    onClose?.();
    navigate(path);
  };

  return (
    <>
      {/* Desktop Sidebar - always visible on lg+ */}
      <aside className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:flex-col lg:w-64 lg:h-screen lg:border-r lg:border-slate-200 lg:bg-white lg:p-4 lg:z-10">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <div
                key={item.path}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => handleNavClick(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item.path)}
              >
                <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="flex-grow" />
        <div className="my-4 border-t border-slate-100" />

        {/* Logout - Desktop */}
        <div
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogout();
            }
          }}
        >
          <span className="text-red-400"><LogOutIcon size={18} /></span>
          Logout
        </div>
      </aside>

      {/* Mobile Sidebar Drawer - slides in from left on small screens */}
      <aside className={`
        fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:hidden
      `}>
        {/* Mobile Drawer Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <div
                key={item.path}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => handleNavClick(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item.path)}
              >
                <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="flex-grow" />
        <div className="my-4 border-t border-slate-100" />

        {/* Logout - Mobile */}
        <div
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogout();
            }
          }}
        >
          <span className="text-red-400"><LogOutIcon size={18} /></span>
          Logout
        </div>
      </aside>
    </>
  );
}
