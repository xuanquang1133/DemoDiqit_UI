
import { ShoppingBagIcon } from '../icons/ShoppingBagIcon';
import { BellIcon } from '../icons/BellIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Button + Brand */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button - Only on mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-800">
          <ShoppingBagIcon size={18} className="text-slate-900" />
          <span className="hidden xs:block">InternShop</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">ADMIN</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100" title="Notifications">
          <BellIcon size={17} />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-2 sm:pr-3 transition-all hover:bg-slate-50">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white uppercase">
            {user?.username?.substring(0, 2) || 'US'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.username || 'User'}</span>
          <ChevronDownIcon size={14} className="opacity-50 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
