import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-card p-6 rounded-lg border ${className}`}>
      {children}
    </div>
  );
}; 