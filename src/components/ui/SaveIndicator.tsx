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
      position: 'relative',
      display: 'inline-flex',
      padding: '6px 12px',
      backgroundColor: 'rgba(16, 185, 129, 0.9)', // Emerald color
      color: 'white',
      borderRadius: '9999px',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      transition: 'opacity 0.2s ease',
      opacity: showCheck ? 1 : 0,
      ...style
    }}>
      <Check size={14} />
      Saved
    </div>
  );
};