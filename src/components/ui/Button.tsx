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
        padding: '4px 8px',
        fontSize: '14px',
        borderRadius: '0',
        minHeight: '28px',
      };
    case 'md':
      return {
        padding: '6px 12px',
        fontSize: '15px',
        borderRadius: '0',
        minHeight: '36px',
      };
    case 'lg':
      return {
        padding: '8px 16px',
        fontSize: '18px',
        borderRadius: '0',
        minHeight: '44px',
      };
    case 'xl':
      return {
        padding: '10px 20px',
        fontSize: '20px',
        borderRadius: '0',
        minHeight: '52px',
      };
    case 'icon':
      return {
        padding: '8px',
        borderRadius: '0',
        minHeight: '36px',
        minWidth: '36px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    default:
      return {
        padding: '6px 12px',
        fontSize: '16px',
        borderRadius: '0',
        minHeight: '36px',
      };
  }
};

// Get variant styles
const getVariantStyles = (variant: ButtonVariant): CSSProperties => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#FFDD00', // Brand Yellow
        color: '#222222', // Black text for contrast
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Black text for readability
        border: '2px solid #FFDD00',
        fontWeight: 'bold',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Black text for readability
        border: 'none',
        fontWeight: 'bold',
      };
    case 'destructive':
      return {
        backgroundColor: '#ef4444', // red-500
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Black text for readability 
        border: 'none',
        padding: '0',
        textDecoration: 'underline',
        boxShadow: 'none',
        minHeight: 'auto',
      };
    case 'subtle':
      return {
        backgroundColor: 'rgba(255, 221, 0, 0.15)', // Yellow with transparency
        color: '#222222', // Black text
        border: 'none',
        fontWeight: 'bold',
      };
    case 'gradient':
      return {
        backgroundColor: '#FFDD00',
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    case 'glass':
      return {
        backgroundColor: '#FFFFFF',
        color: '#222222',
        border: '1px solid #EEEEEE',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      };
    case 'yellow':
      return {
        backgroundColor: '#FFDD00', // Brand Yellow
        color: '#222222', // Black text
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    case 'black':
      return {
        backgroundColor: '#222222', // Brand Black
        color: '#FFFFFF', // White text
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    case 'purple':
      return {
        backgroundColor: '#6B46C1', // Brand Purple
        color: '#FFFFFF', // White text
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    case 'yellowToBlack':
      return {
        backgroundColor: '#FFDD00',
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    case 'yellowToPurple':
      return {
        backgroundColor: '#FFDD00',
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
    default:
      return {
        backgroundColor: '#FFFFFF',
        color: '#222222', // Black text
        border: '1px solid #EEEEEE',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
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