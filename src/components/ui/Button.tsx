import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
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
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 active:bg-secondary-700',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 active:bg-white',
    ghost: 'bg-transparent text-gray-700 hover:bg-white active:bg-white',
    gradient: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-600 hover:to-secondary-600 active:from-primary-700 active:to-secondary-700',
  };

  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
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
          <ArrowRight className="ml-2 h-4 w-4" />
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
    <button className={baseStyles} disabled={isLoading} {...props}>
      {renderContent()}
    </button>
  );
};

export default Button; 