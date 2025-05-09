import React, { CSSProperties } from 'react';

type CardVariant =
  | 'default'
  | 'outline'
  | 'muted'
  | 'gradient'
  | 'yellow'
  | 'black'
  | 'purple'
  | 'glass'
  | 'yellowToBlack'
  | 'blackToYellow'
  | 'yellowToPurple'
  | 'purpleToYellow'
  | 'darkGradient';

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
    case 'sm': return '8px';
    case 'md': return '12px';
    case 'lg': return '16px';
    case 'xl': return '24px';
    case 'none': return '0';
    default: return '12px';
  }
};

const getBorderRadiusValue = (size: BorderRadiusSize): string => {
  switch (size) {
    case 'sm': return '10px';
    case 'md': return '15px';
    case 'lg': return '20px';
    case 'xl': return '25px';
    case '2xl': return '30px';
    case 'full': return '9999px';
    case 'none': return '0';
    default: return '15px';
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
        backgroundColor: '#333333',
        border: '2px solid #fcf720', // Updated to brand Yellow
        color: '#FFFFFF',
      };
    case 'muted':
      return {
        backgroundColor: '#333333',
        border: '1px solid #444444',
        color: '#FFFFFF',
      };
    case 'gradient':
      return {
        backgroundColor: '#333333',
        border: '1px solid #444444',
        color: '#FFFFFF',
      };
    case 'yellow':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
      };
    case 'purple':
      return {
        backgroundColor: '#6B46C1',
        color: '#FFFFFF',
        border: 'none',
      };
    case 'black':
      return {
        backgroundColor: '#222222',
        color: '#FFFFFF',
        border: 'none',
      };
    case 'glass':
      return {
        backgroundColor: '#333333',
        border: '1px solid #444444',
        borderLeft: '3px solid #fcf720', // Updated to brand Yellow
        color: '#FFFFFF',
      };
    case 'yellowToBlack':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
      };
    case 'blackToYellow':
      return {
        backgroundColor: '#222222',
        color: '#FFFFFF',
        border: 'none',
      };
    case 'yellowToPurple':
      return {
        backgroundColor: '#fcf720', // Updated to brand Yellow
        color: '#222222',
        border: 'none',
      };
    case 'purpleToYellow':
      return {
        backgroundColor: '#6B46C1',
        color: '#FFFFFF',
        border: 'none',
      };
    case 'darkGradient':
      return {
        backgroundColor: '#222222',
        color: '#FFFFFF',
        border: '1px solid #fcf720', // Updated to brand Yellow
      };
    default:
      return {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        border: '1px solid #444444',
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
    case 'yellow':
    case 'yellowToBlack':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(252, 247, 32, 0.4), 0 10px 10px -5px rgba(252, 247, 32, 0.2)', // Updated to brand Yellow
      };
    case 'black':
    case 'blackToYellow':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(34, 34, 34, 0.4), 0 10px 10px -5px rgba(34, 34, 34, 0.2)',
      };
    case 'purple':
    case 'yellowToPurple':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(107, 70, 193, 0.4), 0 10px 10px -5px rgba(107, 70, 193, 0.2)',
      };
    case 'purpleToYellow':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(107, 70, 193, 0.4), 0 10px 10px -5px rgba(252, 247, 32, 0.2)', // Updated to brand Yellow
      };
    case 'darkGradient':
      return {
        ...baseHover,
        boxShadow: '0 20px 25px -5px rgba(34, 34, 34, 0.4), 0 10px 10px -5px rgba(34, 34, 34, 0.2)',
        border: '2px solid #fcf720', // Updated to brand Yellow
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
    case 'yellow':
    case 'yellowToBlack':
      gradientColors = 'linear-gradient(135deg, #fcf720, #222222)'; // Updated to brand Yellow
      break;
    case 'black':
    case 'blackToYellow':
      gradientColors = 'linear-gradient(135deg, #222222, #fcf720)'; // Updated to brand Yellow
      break;
    case 'purple':
    case 'yellowToPurple':
      gradientColors = 'linear-gradient(135deg, #fcf720, #6B46C1)'; // Updated to brand Yellow
      break;
    case 'purpleToYellow':
      gradientColors = 'linear-gradient(135deg, #6B46C1, #fcf720)'; // Updated to brand Yellow
      break;
    case 'darkGradient':
      gradientColors = 'linear-gradient(135deg, #222222, #333333)';
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
    backgroundColor: borderGradient ? '#FFFFFF' : undefined,
    height: '100%',
    color: '#222222',
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