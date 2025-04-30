import React, { useState, useEffect } from 'react';
import { Minimize2, X } from 'lucide-react';
import { SparkyMessage } from '../../../services/sparkyService';
import { MessagesContainer } from './MessagesContainer';

interface ExpandedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
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

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isOpen, isDragging, dragStart]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100
    }}>
      <div
        style={{
          position: isDragging ? 'absolute' : 'relative',
          top: isDragging ? `${position.y}px` : 'auto',
          left: isDragging ? `${position.x}px` : 'auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          width: windowWidth < 600 ? '98%' : '95%',
          maxWidth: '800px',
          height: windowHeight < 600 ? '98vh' : '90vh',
          maxHeight: windowHeight < 600 ? '98vh' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          margin: windowWidth < 768 ? '5px' : 'auto',
          resize: 'both', // Allow user resizing
          cursor: isDragging ? 'grabbing' : 'default',
          transition: 'all 0.3s ease', // Smooth transitions
          zIndex: 1200 // Higher z-index to appear above other elements
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
            backgroundColor: '#FFFFFF',
            cursor: isDragging ? 'grabbing' : 'grab', // Indicate draggable
            userSelect: 'none' // Prevent text selection during drag
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '42px', height: '42px', borderRadius: '50%' }}
            />
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Sparky</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              title="Minimize"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Minimize2 size={18} color="#666666" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
  );
};
