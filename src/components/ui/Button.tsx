import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'indigo' | 'pink' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withArrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
  glassmorphism?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  isLoading = false,
  glassmorphism = false,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 active:bg-white',
    ghost: 'bg-transparent text-gray-700 hover:bg-white active:bg-white',
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-indigo-500/20 active:from-indigo-700 active:to-pink-700',
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-500/20',
    pink: 'bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 shadow-pink-500/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-500/20',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm rounded-lg',
    md: 'py-2.5 px-5 text-base rounded-xl',
    lg: 'py-3 px-7 text-lg rounded-xl',
    xl: 'py-4 px-9 text-xl rounded-2xl',
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
    glassmorphism ? 'backdrop-blur-md bg-opacity-80 border border-white/20' : '',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    variant.includes('gradient') ? 'shadow-lg' : 'shadow-md',
    variant.includes('gradient') ? 'hover:shadow-xl' : 'hover:shadow-lg',
    className
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      );
    }

    if (withArrow) {
      return (
        <>
          {children}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      );
    }

    return children;
  };

  return (
    <button 
      className={cn(baseStyles, "group")} 
      disabled={isLoading} 
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button; 