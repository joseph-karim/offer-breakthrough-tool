import React, { CSSProperties, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// Type definitions
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'yellow' | 'black' | 'white' | 'default' | 'gradient' | 'yellowToBlack' | 'yellowToPurple' | 'destructive' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Helper to get size-specific properties
const getSizeProps = (size: ButtonSize): CSSProperties => {
  const fontSizes: Record<ButtonSize, string> = {
    'xs': '12px',
    'sm': '14px',
    'md': '16px',
    'lg': '18px',
    'xl': '20px',
    'icon': '16px',
  };

  const padding: Record<ButtonSize, string> = {
    'xs': '6px 10px',
    'sm': '8px 12px',
    'md': '10px 16px',
    'lg': '12px 20px',
    'xl': '14px 24px',
    'icon': '6px',
  };

  return {
    fontSize: fontSizes[size],
    padding: padding[size],
    borderRadius: '2px',
  };
};

// Get variant styles
const getVariantStyles = (variant: ButtonVariant): CSSProperties => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222', // Black text for contrast
        border: 'none',
        fontWeight: 'bold',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      };
    case 'secondary':
      return {
        backgroundColor: '#222222', // Brand Black
        color: '#FFFFFF', // White text for contrast
        border: 'none',
        fontWeight: 'bold',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Black text for readability
        border: '2px solid #fcf720', // Updated to brand Yellow
        fontWeight: 'bold',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Brand Black
        border: 'none',
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        color: '#222222', // Brand Black
        border: 'none',
        textDecoration: 'underline',
      };
    case 'yellow':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'black':
      return {
        backgroundColor: '#222222', // Brand Black
        color: '#FFFFFF', // White text for contrast
        border: 'none',
        fontWeight: 'bold',
        boxShadow: 'none',
      };
    case 'white':
      return {
        backgroundColor: '#FFFFFF',
        color: '#222222',
        border: '1px solid #EEEEEE',
        fontWeight: 'bold',
      };
    case 'gradient':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'yellowToBlack':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'yellowToPurple':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'destructive':
      return {
        backgroundColor: '#FF0000',
        color: '#FFFFFF',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'success':
      return {
        backgroundColor: '#10B981',
        color: '#FFFFFF',
        border: 'none',
        fontWeight: 'bold',
      };
    case 'default':
    default:
      return {};
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
  // Get the base styles
  const sizeProps = getSizeProps(size);
  const variantStyles = getVariantStyles(variant);

  // Combine all styles
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
    ...sizeProps,
    ...variantStyles,
    ...(disabled || isLoading ? { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' } : {}),
    ...style,
  };

  // Special case for icon size
  if (size === 'icon') {
    buttonStyle.padding = '6px';
    buttonStyle.height = buttonStyle.width = '32px';
    buttonStyle.borderRadius = '4px';
  }

  return (
    <button
      style={buttonStyle}
      className={`button ${className}`}
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
        <span style={{ marginRight: children ? '8px' : '0', display: 'inline-flex' }}>
          {leftIcon}
        </span>
      )}

      {children}

      {!isLoading && rightIcon && (
        <span style={{ marginLeft: children ? '8px' : '0', display: 'inline-flex' }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};