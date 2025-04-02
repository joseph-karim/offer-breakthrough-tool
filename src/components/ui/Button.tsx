import React from 'react';
import { ArrowRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  withArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  withArrow = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold inline-flex items-center justify-center transition-colors duration-150 ease-in-out rounded-md';
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-700 text-white',
    secondary: 'bg-secondary hover:bg-secondary-700 text-white',
    outline: 'border border-primary text-primary hover:bg-primary-50',
    ghost: 'text-primary hover:bg-primary-50',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <button className={styles} {...props}>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      {withArrow && <ArrowRight className="ml-2 h-4 w-4" />}
    </button>
  );
};

export default Button; 