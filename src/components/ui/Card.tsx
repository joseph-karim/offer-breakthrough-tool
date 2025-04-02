import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'muted' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    outline: 'bg-white border border-gray-200',
    muted: 'bg-gray-50 border border-gray-100',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover 
    ? 'hover:shadow-md hover:border-gray-300 hover:scale-[1.01]' 
    : '';
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`;
  
  return (
    <div className={styles}>
      {children}
    </div>
  );
};

export default Card; 