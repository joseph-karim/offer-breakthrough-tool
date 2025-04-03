import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      maxWidth: '250px',
      zIndex: 50,
      pointerEvents: 'none' as const,
      transition: 'opacity 0.2s ease',
      opacity: isVisible ? 1 : 0,
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        };
      case 'bottom':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(8px)',
        };
      case 'left':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(-8px)',
        };
      case 'right':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(8px)',
        };
      default:
        return base;
    }
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={getPositionStyles()}>
        {content}
      </div>
    </div>
  );
}; 