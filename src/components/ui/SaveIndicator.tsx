import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface SaveIndicatorProps {
  saving?: boolean;
  style?: React.CSSProperties;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ saving, style }) => {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (saving) {
      // Hide the check after animation completes
      const timer = setTimeout(() => setShowCheck(true), 100);
      const hideTimer = setTimeout(() => setShowCheck(false), 1500);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [saving]);

  if (!saving && !showCheck) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '8px 16px',
      backgroundColor: 'rgba(16, 185, 129, 0.9)', // Emerald color
      color: 'white',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'opacity 0.2s ease',
      opacity: showCheck ? 1 : 0,
      ...style
    }}>
      <Check size={16} />
      Saved
    </div>
  );
}; 