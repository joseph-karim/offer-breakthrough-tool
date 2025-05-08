import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { MobileTooltip } from './MobileTooltip';

interface ResponsiveTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  mobileBreakpoint?: number;
}

export const ResponsiveTooltip: React.FC<ResponsiveTooltipProps> = ({
  content,
  children,
  position = 'top',
  maxWidth = 350,
  mobileBreakpoint = 768, // Default breakpoint for mobile devices
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileBreakpoint]);

  return isMobile ? (
    <MobileTooltip content={content} maxWidth={maxWidth}>
      {children}
    </MobileTooltip>
  ) : (
    <Tooltip content={content} position={position} maxWidth={maxWidth}>
      {children}
    </Tooltip>
  );
};