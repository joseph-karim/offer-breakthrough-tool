import React, { useState, useEffect } from 'react';
import { Minimize2, X } from 'lucide-react';
import { SparkyMessage } from '../../../services/sparkyService';
import { MessagesContainer } from './MessagesContainer';

interface ExpandedChatModalProps {
  isOpen: boolean;
  onClose: () => void; // Function to close the modal
  messages: SparkyMessage[];
  isTyping: boolean;
  currentStep: number;
  renderMessage: (message: SparkyMessage) => React.ReactNode;
  inputContainer: React.ReactNode;
}

export const ExpandedChatModal: React.FC<ExpandedChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  isTyping,
  currentStep,
  renderMessage,
  inputContainer
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update window dimensions when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.modal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep modal within viewport bounds
      const modalWidth = Math.min(800, windowWidth * 0.9);
      const modalHeight = Math.min(windowHeight * 0.9, 600);

      const boundedX = Math.max(0, Math.min(newX, windowWidth - modalWidth));
      const boundedY = Math.max(0, Math.min(newY, windowHeight - modalHeight));

      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // Prevent scrolling of the background when modal is open
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // Restore scrolling when modal is closed
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isDragging, dragStart]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Define animation keyframes
  const animationStyles = `
    @keyframes modalFadeIn {
      0% {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Add a pulsing effect to the buttons */
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 221, 0, 0.4);
      }
      70% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(255, 221, 0, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 221, 0, 0);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
    <div
      onClick={(e) => {
        // Close the modal when clicking on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2147483647, // Maximum possible z-index value
        backdropFilter: 'blur(3px)', // Add blur effect to background
        pointerEvents: 'auto', // Ensure it captures all mouse events
        isolation: 'isolate', // Create a new stacking context
        transform: 'translateZ(9999px)', // Force to front layer
        willChange: 'transform', // Optimize for animations
        overflow: 'hidden' // Prevent content from overflowing
      }}>
      <div
        style={{
          position: isDragging ? 'absolute' : 'relative',
          top: isDragging ? `${position.y}px` : 'auto',
          left: isDragging ? `${position.x}px` : 'auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          width: windowWidth < 600 ? '90%' : '75%',
          maxWidth: '850px',
          height: windowHeight < 600 ? '80vh' : '65vh',
          maxHeight: windowHeight < 600 ? '80vh' : '65vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          margin: '80px auto', // Further increased margin to prevent overlap with top elements
          resize: 'both', // Allow user resizing
          cursor: isDragging ? 'grabbing' : 'default',
          transition: 'all 0.3s ease', // Smooth transitions
          zIndex: 2147483647, // Maximum possible z-index
          animation: 'modalFadeIn 0.3s ease-out', // Add animation for better UX
          transform: 'translateZ(9999px)', // Force to front layer
          willChange: 'transform', // Optimize for animations
          isolation: 'isolate' // Create a new stacking context
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #EEEEEE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFDD00', // Yellow background to match branding
            cursor: isDragging ? 'grabbing' : 'grab', // Indicate draggable
            userSelect: 'none', // Prevent text selection during drag
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '42px', height: '42px', borderRadius: '50%' }}
            />
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#222222' }}>Sparky</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onClose(); // Call the onClose function to minimize
              }}
              title="Minimize"
              aria-label="Minimize chat"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Minimize2 size={18} color="#666666" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onClose(); // Call the onClose function to close
              }}
              title="Close"
              aria-label="Close chat"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={18} color="#666666" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <MessagesContainer
          messages={messages}
          isTyping={isTyping}
          currentStep={currentStep}
          renderMessage={renderMessage}
        />

        {/* Input Container */}
        {inputContainer}
      </div>
    </div>
    </>
  );
};
