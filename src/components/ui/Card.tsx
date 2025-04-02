import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'muted' | 'gradient' | 'primary' | 'secondary' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  borderRadius = 'lg',
  shadow = 'sm',
}) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    outline: 'bg-white border border-gray-200',
    primary: 'bg-primary-50 border border-primary-100',
    secondary: 'bg-secondary-50 border border-secondary-100',
    muted: 'border border-gray-100',
    gradient: 'bg-gradient-to-br from-white via-primary-50 to-white border border-primary-100',
    glass: 'bg-white/70 backdrop-blur-md border border-white/30',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const borderRadiusStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  const hoverStyles = hover 
    ? 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]' 
    : 'transition-all duration-200';
  
  const styles = cn(
    borderRadiusStyles[borderRadius],
    shadowStyles[shadow],
    variantStyles[variant], 
    paddingStyles[padding], 
    hoverStyles,
    className
  );
  
  return (
    <div className={styles}>
      {children}
    </div>
  );
};

export default Card; 