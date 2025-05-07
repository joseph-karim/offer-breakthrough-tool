import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number; // Delay before showing tooltip (ms)
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  maxWidth = 350, // Increased default max width
  delay = 200 // Small delay to prevent accidental triggers
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate tooltip position based on available space
  const calculatePosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Base styles
    const base: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '10px 14px', // Slightly increased padding
      borderRadius: '6px',
      fontSize: '14px',
      lineHeight: '1.5', // Improved line height for readability
      maxWidth: `${maxWidth}px`,
      zIndex: 1000, // Higher z-index to ensure visibility
      pointerEvents: 'none' as const,
      transition: 'opacity 0.2s ease',
      opacity: isVisible ? 1 : 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      wordWrap: 'break-word', // Ensure text wraps
      whiteSpace: 'pre-wrap', // Preserve line breaks
      textAlign: 'left',
    };

    let newPosition: React.CSSProperties = { ...base };

    // Determine best position based on available space
    let finalPosition = position;

    // Check if there's enough space in the preferred position
    // If not, flip to the opposite side
    switch (position) {
      case 'top':
        if (containerRect.top < tooltipRect.height + 8) {
          finalPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (windowHeight - containerRect.bottom < tooltipRect.height + 8) {
          finalPosition = 'top';
        }
        break;
      case 'left':
        if (containerRect.left < tooltipRect.width + 8) {
          finalPosition = 'right';
        }
        break;
      case 'right':
        if (windowWidth - containerRect.right < tooltipRect.width + 8) {
          finalPosition = 'left';
        }
        break;
    }

    // Apply position based on final determination
    switch (finalPosition) {
      case 'top':
        newPosition = {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        };
        break;
      case 'bottom':
        newPosition = {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(8px)',
        };
        break;
      case 'left':
        newPosition = {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(-8px)',
        };
        break;
      case 'right':
        newPosition = {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(8px)',
        };
        break;
    }

    // Additional adjustments to prevent overflow
    if (finalPosition === 'top' || finalPosition === 'bottom') {
      // Check if tooltip would overflow left edge
      if (containerRect.left + (tooltipRect.width / 2) > windowWidth) {
        const rightOffset = Math.min(windowWidth - containerRect.right, tooltipRect.width / 2);
        newPosition.left = 'auto';
        newPosition.right = `${rightOffset}px`;
        newPosition.transform = finalPosition === 'top'
          ? 'translateY(-8px)'
          : 'translateY(8px)';
      }
      // Check if tooltip would overflow right edge
      else if (containerRect.right - (tooltipRect.width / 2) < 0) {
        const leftOffset = Math.min(containerRect.left, tooltipRect.width / 2);
        newPosition.left = `${leftOffset}px`;
        newPosition.transform = finalPosition === 'top'
          ? 'translateY(-8px)'
          : 'translateY(8px)';
      }
    }

    setTooltipPosition(newPosition);
  };

  // Handle showing/hiding tooltip with delay
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  // Calculate position when visibility changes or on window resize
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }

    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isVisible]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0} // Make it focusable for accessibility
      aria-describedby={isVisible ? 'tooltip' : undefined}
    >
      {children}
      <div
        ref={tooltipRef}
        id="tooltip"
        role="tooltip"
        style={tooltipPosition}
        aria-hidden={!isVisible}
      >
        {content}
      </div>
    </div>
  );
};