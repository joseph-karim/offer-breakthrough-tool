import React, { useState, useRef } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingArrow,
  Placement,
} from '@floating-ui/react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  maxWidth?: number;
  delay?: number;
  className?: string;
  arrowClassName?: string;
  contentClassName?: string;
}

export const FloatingTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  maxWidth = 350,
  delay = 200,
  className = '',
  arrowClassName = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  // Setup floating UI
  const {
    x,
    y,
    strategy,
    refs,
    context,
  } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(8), // Space between tooltip and trigger
      flip(), // Flip to opposite side if no space
      shift({ padding: 8 }), // Shift along the axis if needed
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Setup interactions (hover, focus, etc.)
  const hover = useHover(context, {
    delay: { open: delay, close: 0 },
    restMs: 40,
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  // Merge all interactions
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // Base styles for tooltip
  const baseTooltipStyles: React.CSSProperties = {
    position: strategy,
    top: y ?? 0,
    left: x ?? 0,
    maxWidth: `${maxWidth}px`,
    width: 'max-content',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`inline-flex items-center ${className}`}
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          style={baseTooltipStyles}
          className={`bg-gray-800 text-white rounded-md p-3 text-sm shadow-lg ${contentClassName}`}
        >
          {typeof content === 'string' ? (
            <div className="whitespace-normal leading-5">{content}</div>
          ) : (
            content
          )}
          <FloatingArrow
            ref={arrowRef}
            context={context}
            fill="#1f2937" // Match bg-gray-800
            className={arrowClassName}
          />
        </div>
      )}
    </>
  );
};

// Mobile version that shows a modal-like tooltip on touch devices
export const MobileFloatingTooltip: React.FC<Omit<TooltipProps, 'placement'>> = ({
  content,
  children,
  maxWidth = 350,
  className = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div onClick={handleToggle}>
        {children}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[2147483647] flex justify-center items-center p-4"
          onClick={handleClose}
        >
          <div
            className={`bg-gray-800 text-white p-4 rounded-lg w-full max-h-[80vh] overflow-y-auto relative shadow-xl ${contentClassName}`}
            style={{ maxWidth: `${maxWidth}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-transparent border-none text-white cursor-pointer p-1"
              onClick={handleClose}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="mt-2 leading-6 text-base">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Responsive tooltip that switches between desktop and mobile versions
export const ResponsiveFloatingTooltip: React.FC<TooltipProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < (props.maxWidth || 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [props.maxWidth]);

  if (isMobile) {
    return <MobileFloatingTooltip {...props} />;
  }

  return <FloatingTooltip {...props} />;
};
