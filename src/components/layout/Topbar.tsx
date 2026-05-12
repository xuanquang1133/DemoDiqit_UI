// src/components/layout/Topbar.tsx
import { ShoppingBag, Bell, ChevronDown } from '../icons';

export default function Topbar() {
  return (
    <header className="cms-topbar">
      {/* Brand */}
      <div className="cms-topbar__brand">
        <ShoppingBag size={20} strokeWidth={2.5} />
        InternShop
        <span className="badge">ADMIN</span>
      </div>

      {/* Actions */}
      <div className="cms-topbar__actions">
        <button className="cms-topbar__icon-btn" title="Notifications">
          <Bell size={17} />
        </button>
        <button className="cms-topbar__avatar">
          <div className="cms-topbar__avatar-img">AD</div>
          <span>Admin</span>
          <ChevronDown size={14} strokeWidth={2.5} style={{ opacity: 0.7 }} />
        </button>
      </div>
    </header>
  );
}
