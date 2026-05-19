import type { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const CustomButton = ({ 
  children, 
  className = "", 
  variant = 'primary',
  ...props 
}: CustomButtonProps) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200",
    danger: "text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-500",
    ghost: "text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-500"
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
