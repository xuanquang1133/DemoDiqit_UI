import type { ButtonHTMLAttributes } from 'react';

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onCancel: () => void;
}

export const CancelButton = ({ onCancel, disabled, className = '', ...props }: CancelButtonProps) => {
  return (
    <button
      type="button"
      onClick={onCancel}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200 ${className}`}
      {...props}
    >
      Cancel
    </button>
  );
};
