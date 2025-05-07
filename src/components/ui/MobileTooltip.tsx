import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MobileTooltipProps {
  content: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export const MobileTooltip: React.FC<MobileTooltipProps> = ({
  content,
  children,
  maxWidth = 350,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={handleToggle}>
        {children}
      </div>
      
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
          }}
          onClick={handleClose}
        >
          <div
            style={{
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '16px',
              borderRadius: '8px',
              maxWidth: `${maxWidth}px`,
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
              }}
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div style={{ marginTop: '8px', lineHeight: 1.5, fontSize: '16px' }}>
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
