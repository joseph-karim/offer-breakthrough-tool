import React, { CSSProperties, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 
  | 'default'
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'subtle'
  | 'gradient'
  | 'glass'
  | 'yellow'
  | 'black'
  | 'purple'
  | 'yellowToBlack'
  | 'yellowToPurple';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Get size related styles
const getSizeStyles = (size: ButtonSize): CSSProperties => {
  switch (size) {
    case 'sm':
      return {
        padding: '6px 12px',
        fontSize: '14px',
        borderRadius: '6px',
        minHeight: '32px',
      };
    case 'md':
      return {
        padding: '8px 16px',
        fontSize: '16px',
        borderRadius: '8px',
        minHeight: '40px',
      };
    case 'lg':
      return {
        padding: '10px 20px',
        fontSize: '18px',
        borderRadius: '10px',
        minHeight: '48px',
      };
    case 'xl':
      return {
        padding: '12px 24px',
        fontSize: '20px',
        borderRadius: '12px',
        minHeight: '56px',
      };
    case 'icon':
      return {
        padding: '8px',
        borderRadius: '8px',
        minHeight: '40px',
        minWidth: '40px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    default:
      return {
        padding: '8px 16px',
        fontSize: '16px',
        borderRadius: '8px',
        minHeight: '40px',
      };
  }
};

// Get variant styles
const getVariantStyles = (variant: ButtonVariant): CSSProperties => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#FFDD00', // CustomerCamp Yellow
        color: '#222222', // Black text for contrast
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: '#4f46e5', // indigo-600
        border: '1px solid #4f46e5',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: '#4f46e5', // indigo-600
        border: 'none',
      };
    case 'destructive':
      return {
        backgroundColor: '#ef4444', // red-500
        color: 'white',
        border: 'none',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        color: '#4f46e5', // indigo-600
        border: 'none',
        padding: '0',
        textDecoration: 'underline',
        boxShadow: 'none',
        minHeight: 'auto',
      };
    case 'subtle':
      return {
        backgroundColor: '#eff6ff', // indigo-50
        color: '#4f46e5', // indigo-600
        border: 'none',
      };
    case 'gradient':
      return {
        background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      };
    case 'glass':
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#1f2937', // gray-800
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'yellow':
      return {
        backgroundColor: '#FFDD00', // CustomerCamp Yellow
        color: '#222222', // Black text for contrast
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(255, 221, 0, 0.4), 0 2px 4px -1px rgba(255, 221, 0, 0.06)',
      };
    case 'black':
      return {
        backgroundColor: '#222222', // CustomerCamp Black
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(34, 34, 34, 0.4), 0 2px 4px -1px rgba(34, 34, 34, 0.06)',
      };
    case 'purple':
      return {
        backgroundColor: '#6B46C1', // CustomerCamp Purple
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(107, 70, 193, 0.4), 0 2px 4px -1px rgba(107, 70, 193, 0.06)',
      };
    case 'yellowToBlack':
      return {
        background: 'linear-gradient(135deg, #FFDD00 0%, #222222 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(255, 221, 0, 0.4), 0 2px 4px -1px rgba(255, 221, 0, 0.06)',
      };
    case 'yellowToPurple':
      return {
        background: 'linear-gradient(135deg, #FFDD00 0%, #6B46C1 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(255, 221, 0, 0.4), 0 2px 4px -1px rgba(255, 221, 0, 0.06)',
      };
    default:
      return {
        backgroundColor: 'white',
        color: '#111827', // gray-900
        border: '1px solid #e5e7eb', // gray-200
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
  }
};

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style = {},
  ...props
}: ButtonProps) => {
  // Animation styles for hover, focus, and active states
  const cssAnimations = `
    @keyframes shimmer {
      0% { background-position: 0% 0%; }
      50% { background-position: 100% 100%; }
      100% { background-position: 0% 0%; }
    }
    
    .gradient-btn {
      background-size: 200% 200%;
      animation: shimmer 8s ease infinite;
      transition: all 0.3s ease;
    }
    
    .gradient-btn:hover {
      animation: shimmer 2s ease infinite;
      transform: translateY(-1px);
    }
  `;

  // Combine all styles
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant);
  
  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    textAlign: 'center',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    ...sizeStyles,
    ...variantStyles,
    ...(disabled || isLoading ? { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' } : {}),
    ...style,
  };

  // Add custom class names for animation capabilities
  const isGradientVariant = 
    variant === 'gradient' || 
    variant === 'yellowToBlack' || 
    variant === 'yellowToPurple';
  
  const effectiveClassName = `
    button
    ${isGradientVariant ? 'gradient-btn' : ''}
    ${className}
  `;

  return (
    <>
      <style>{cssAnimations}</style>
      <button
        style={buttonStyle}
        className={effectiveClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span style={{ 
            marginRight: children ? '8px' : '0', 
            animation: 'spin 2s linear infinite',
            display: 'inline-flex',
          }}>
            <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} />
          </span>
        )}
        
        {!isLoading && leftIcon && (
          <span style={{ marginRight: '8px', display: 'inline-flex' }}>
            {leftIcon}
          </span>
        )}
        
        {children}
        
        {!isLoading && rightIcon && (
          <span style={{ marginLeft: '8px', display: 'inline-flex' }}>
            {rightIcon}
          </span>
        )}
      </button>
    </>
  );
};        