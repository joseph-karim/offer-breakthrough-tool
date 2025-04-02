import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}) => {
  const baseClasses = "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-primary text-white shadow-sm hover:bg-primary-600 focus:ring-primary-500",
    secondary: "bg-secondary text-white shadow-sm hover:bg-secondary-600 focus:ring-secondary-500",
    outline: "bg-transparent text-gray-900 border border-gray-300 hover:bg-white hover:border-gray-400 focus:ring-gray-500"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const buttonClasses = `${baseClasses} ${variantStyles[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}; 