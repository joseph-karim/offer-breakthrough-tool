import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'muted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseStyles = 'rounded-lg';
  
  const variantStyles = {
    default: 'bg-white shadow-sm border border-gray-200',
    outline: 'bg-white border border-gray-200',
    muted: 'bg-gray-50',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`;
  
  return (
    <div className={styles}>
      {children}
    </div>
  );
};

export default Card; 