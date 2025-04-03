import React, { CSSProperties } from 'react';

type CardVariant = 
  | 'default' 
  | 'outline' 
  | 'muted' 
  | 'gradient' 
  | 'indigo' 
  | 'purple' 
  | 'pink' 
  | 'glass'
  | 'indigoToBlue'
  | 'purpleToIndigo'
  | 'pinkToPurple'
  | 'skyToIndigo'
  | 'tealToLime';

type PaddingSize = 'sm' | 'md' | 'lg' | 'xl' | 'none';
type BorderRadiusSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
type ShadowSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: PaddingSize;
  hover?: boolean;
  borderRadius?: BorderRadiusSize;
  shadow?: ShadowSize;
  borderGradient?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Helper functions to convert props to CSS values
const getPaddingValue = (size: PaddingSize): string => {
  switch (size) {
    case 'sm': return '16px';
    case 'md': return '24px';
    case 'lg': return '32px';
    case 'xl': return '48px';
    case 'none': return '0';
    default: return '24px';
  }
};

const getBorderRadiusValue = (size: BorderRadiusSize): string => {
  switch (size) {
    case 'sm': return '8px';
    case 'md': return '12px';
    case 'lg': return '16px';
    case 'xl': return '24px';
    case '2xl': return '32px';
    case 'full': return '9999px';
    case 'none': return '0';
    default: return '12px';
  }
};

const getShadowValue = (size: ShadowSize): string => {
  switch (size) {
    case 'sm': return '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)';
    case 'md': return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    case 'lg': return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    case 'xl': return '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    case '2xl': return '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    case 'inner': return 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)';
    case 'none': return 'none';
    default: return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  }
};

// Helper to get variant-specific styles
const getVariantStyles = (variant: CardVariant): CSSProperties => {
  switch (variant) {
    case 'outline':
      return {
        backgroundColor: 'white',
        border: '1px solid rgba(229, 231, 235, 1)', // gray-200
      };
    case 'muted':
      return {
        backgroundColor: 'rgba(249, 250, 251, 1)', // gray-50
        border: '1px solid rgba(243, 244, 246, 1)', // gray-100
      };
    case 'gradient':
      return {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      };
    case 'indigo':
      return {
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        border: 'none',
      };
    case 'purple':
      return {
        background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
        color: 'white',
        border: 'none',
      };
    case 'pink':
      return {
        background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
        color: 'white',
        border: 'none',
      };
    case 'glass':
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
      };
    case 'indigoToBlue':
      return {
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: 'white',
        border: 'none',
      };
    case 'purpleToIndigo':
      return {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)',
        color: 'white',
        border: 'none',
      };
    case 'pinkToPurple':
      return {
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
        color: 'white',
        border: 'none',
      };
    case 'skyToIndigo':
      return {
        background: 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)',
        color: 'white',
        border: 'none',
      };
    case 'tealToLime':
      return {
        background: 'linear-gradient(135deg, #14b8a6 0%, #84cc16 100%)',
        color: 'white',
        border: 'none',
      };
    default:
      return {
        backgroundColor: 'white',
        border: '1px solid rgba(243, 244, 246, 1)', // gray-100
      };
  }
};

// Get hover styles based on variant
const getHoverStyles = (variant: CardVariant, shouldHover: boolean): CSSProperties => {
  if (!shouldHover) return {};

  const baseHover: CSSProperties = {
    transform: 'translateY(-5px)',
  };

  switch (variant) {
    case 'default':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      };
    case 'outline':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: 'rgba(209, 213, 219, 1)', // gray-300
      };
    case 'glass':
      return {
        ...baseHover,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      };
    case 'indigo':
    case 'indigoToBlue':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2)',
      };
    case 'purple':
    case 'purpleToIndigo':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.2)',
      };
    case 'pink':
    case 'pinkToPurple':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(236, 72, 153, 0.4), 0 10px 10px -5px rgba(236, 72, 153, 0.2)',
      };
    case 'skyToIndigo':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4), 0 10px 10px -5px rgba(14, 165, 233, 0.2)',
      };
    case 'tealToLime':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(20, 184, 166, 0.4), 0 10px 10px -5px rgba(20, 184, 166, 0.2)',
      };
    default:
      return baseHover;
  }
};

// Gradient border styling
const getBorderGradientStyle = (variant: CardVariant, hasBorderGradient: boolean): CSSProperties => {
  if (!hasBorderGradient) return {};

  let gradientColors = '';
  switch (variant) {
    case 'indigo':
    case 'indigoToBlue':
      gradientColors = 'linear-gradient(135deg, #4f46e5, #3b82f6)';
      break;
    case 'purple':
    case 'purpleToIndigo':
      gradientColors = 'linear-gradient(135deg, #8b5cf6, #4f46e5)';
      break;
    case 'pink':
    case 'pinkToPurple':
      gradientColors = 'linear-gradient(135deg, #ec4899, #8b5cf6)';
      break;
    case 'skyToIndigo':
      gradientColors = 'linear-gradient(135deg, #0ea5e9, #4f46e5)';
      break;
    case 'tealToLime':
      gradientColors = 'linear-gradient(135deg, #14b8a6, #84cc16)';
      break;
    default:
      gradientColors = 'linear-gradient(135deg, #4f46e5, #ec4899)';
  }

  return {
    border: 'none',
    backgroundImage: gradientColors,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: 'none',
    position: 'relative',
    padding: '1px', // This creates space for the border
  };
};

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  borderRadius = 'lg',
  shadow = 'md',
  borderGradient = false,
  onClick,
  className = '',
  style = {},
}: CardProps) => {
  // Animation styles
  const animationStyles = `
    @keyframes shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  // Get basic styles
  const paddingValue = getPaddingValue(padding);
  const borderRadiusValue = getBorderRadiusValue(borderRadius);
  const shadowValue = getShadowValue(shadow);
  const variantStyles = getVariantStyles(variant);
  const hoverStyles = getHoverStyles(variant, hover);
  const borderGradientStyles = getBorderGradientStyle(variant, borderGradient);

  // Combine all styles
  const cardStyle: CSSProperties = {
    borderRadius: borderRadiusValue,
    boxShadow: shadowValue,
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    position: 'relative',
    ...variantStyles,
    ...style,
  };

  // Add hover styles if needed
  if (hover) {
    Object.assign(cardStyle, {
      '&:hover': hoverStyles,
    });
  }

  // Create inner content container for gradient borders
  const contentStyle: CSSProperties = {
    padding: paddingValue,
    borderRadius: borderGradient ? `calc(${borderRadiusValue} - 1px)` : undefined,
    backgroundColor: borderGradient ? 'white' : undefined,
    height: '100%',
  };

  // Handle gradient borders
  if (borderGradient) {
    Object.assign(cardStyle, borderGradientStyles);
  }

  return (
    <>
      <style>
        {animationStyles}
        {hover && `
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: ${getHoverStyles(variant, true).boxShadow || shadowValue};
          }
        `}
      </style>
      <div
        className={`card ${hover ? 'hover-card' : ''} ${className}`}
        style={cardStyle}
        onClick={onClick}
      >
        {borderGradient ? (
          <div style={contentStyle}>
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}; 