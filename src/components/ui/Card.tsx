import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 
    'default' | 
    'outline' | 
    'muted' | 
    'gradient' | 
    'primary' | 
    'secondary' | 
    'glass' | 
    'colorful' | 
    'indigo' | 
    'purple' | 
    'pink' | 
    'gradient-indigo' |
    'gradient-purple' |
    'gradient-pink';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderGradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  borderRadius = 'lg',
  shadow = 'sm',
  borderGradient = false,
}) => {
  const variantStyles = {
    default: 'bg-white border border-gray-200',
    outline: 'bg-white border border-gray-200',
    primary: 'bg-primary-50 border border-primary-100',
    secondary: 'bg-secondary-50 border border-secondary-100',
    muted: 'border border-gray-100',
    gradient: 'bg-gradient-to-br from-white via-primary-50 to-white border border-primary-100',
    glass: 'bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-30',
    colorful: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 border border-indigo-100',
    indigo: 'bg-indigo-50 border border-indigo-200',
    purple: 'bg-purple-50 border border-purple-200',
    pink: 'bg-pink-50 border border-pink-200',
    'gradient-indigo': 'bg-gradient-to-br from-indigo-50 to-white border border-indigo-100',
    'gradient-purple': 'bg-gradient-to-br from-purple-50 to-white border border-purple-100',
    'gradient-pink': 'bg-gradient-to-br from-pink-50 to-white border border-pink-100',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
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
    '2xl': 'shadow-2xl',
  };
  
  // Different hover effects based on variant
  const getHoverStyles = () => {
    if (!hover) return 'transition-all duration-200';
    
    if (variant.includes('gradient') || variant === 'colorful') {
      return 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]';
    }
    
    if (variant === 'glass') {
      return 'transition-all duration-300 hover:shadow-lg hover:bg-white hover:bg-opacity-80 hover:-translate-y-1';
    }
    
    return 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1';
  };
  
  // Option for gradient border
  const getBorderGradientStyle = () => {
    if (!borderGradient) return '';
    
    return 'border-0 bg-gradient-padding p-[1px]';
  };
  
  const hoverStyles = getHoverStyles();
  const borderGradientStyle = getBorderGradientStyle();
  
  // Determine the main class for the component
  const cardClasses = cn(
    borderRadiusStyles[borderRadius],
    shadowStyles[shadow],
    borderGradientStyle ? '' : variantStyles[variant],
    hoverStyles,
    borderGradientStyle,
    className
  );
  
  // If using a gradient border, need to wrap the content
  if (borderGradient) {
    return (
      <div className={cardClasses}>
        <div className={cn(
          'h-full w-full bg-white',
          borderRadiusStyles[borderRadius],
          paddingStyles[padding]
        )}>
          {children}
        </div>
      </div>
    );
  }
  
  // Standard rendering without gradient border
  return (
    <div className={cn(cardClasses, paddingStyles[padding])}>
      {children}
    </div>
  );
};

export default Card; 