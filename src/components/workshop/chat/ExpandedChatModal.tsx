import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2, X, Send, Loader2 } from 'lucide-react';
import { SparkyMessage } from '../../../services/sparkyService';
import { MessagesContainer } from './MessagesContainer';
import { createPortal } from 'react-dom';
import { Button } from '../../ui/Button';

interface ExpandedChatModalProps {
  isOpen: boolean;
  onClose: () => void; // Function to close the modal
  messages: SparkyMessage[];
  isTyping: boolean;
  currentStep: number;
  renderMessage: (message: SparkyMessage) => React.ReactNode;
  handleSendMessage: (message: string) => void; // Function to send a message
  suggestionsPanel?: React.ReactNode; // Optional suggestions panel
}

export const ExpandedChatModal: React.FC<ExpandedChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  isTyping,
  currentStep,
  renderMessage,
  handleSendMessage,
  suggestionsPanel
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');

  // Handle key press (Enter to send)
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isTyping) {
        handleSendMessage(inputValue);
        setInputValue('');
      }
    }
  }, [inputValue, isTyping, handleSendMessage]);

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
    if (isOpen && isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isOpen, isDragging, dragStart]);

  // Create a div for the modal root if it doesn't exist
  const getOrCreateModalRoot = () => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    return modalRoot;
  };

  // Create a div for this specific modal instance
  const [modalElement] = useState(() => document.createElement('div'));

  // Add styles to ensure modal is on top
  useEffect(() => {
    if (isOpen) {
      const modalRoot = getOrCreateModalRoot();

      // Apply styles to the modal element
      modalElement.style.position = 'fixed';
      modalElement.style.top = '0';
      modalElement.style.left = '0';
      modalElement.style.right = '0';
      modalElement.style.bottom = '0';
      modalElement.style.zIndex = '2147483647'; // Max possible z-index
      modalElement.style.display = 'flex';
      modalElement.style.justifyContent = 'center';
      modalElement.style.alignItems = 'center';

      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';

      // Append the element to the modal root
      modalRoot.appendChild(modalElement);

      // Add a class to the body to help with styling
      document.body.classList.add('modal-open');

      return () => {
        // Clean up when the component unmounts or when isOpen changes to false
        modalRoot.removeChild(modalElement);
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen, modalElement]);

  if (!isOpen) return null;

  // Define animation keyframes
  const animationStyles = `
    @keyframes modalFadeIn {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;

  return createPortal(
    <>
      <style>{animationStyles}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2147483647
        }}
        onClick={(e) => {
          // Close the modal when clicking on the backdrop
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          style={{
            position: isDragging ? 'absolute' : 'relative',
            top: isDragging ? `${position.y}px` : 'auto',
            left: isDragging ? `${position.x}px` : 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1200px',
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            margin: '20px auto',
            resize: 'both',
            cursor: isDragging ? 'grabbing' : 'default',
            transition: 'all 0.3s ease',
            animation: 'modalFadeIn 0.3s ease-out',
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
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
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
                  e.stopPropagation();
                  onClose();
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
                  e.stopPropagation();
                  onClose();
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

          {/* Suggestions Panel */}
          {suggestionsPanel}

          {/* Input Container */}
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #EEEEEE',
              display: 'flex',
              gap: '12px',
              backgroundColor: '#FFFFFF'
            }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flexGrow: 1,
                border: '1px solid #EEEEEE',
                borderRadius: '15px',
                padding: '12px 16px',
                resize: 'vertical',
                minHeight: '50px',
                maxHeight: '200px',
                fontSize: '16px',
                lineHeight: 1.6,
                overflowY: 'auto',
                backgroundColor: '#F5F5F5',
                color: '#333333'
              }}
              rows={2}
            />
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (inputValue.trim() && !isTyping) {
                  handleSendMessage(inputValue);
                  setInputValue('');
                }
              }}
              disabled={!inputValue.trim() || isTyping}
              style={{
                alignSelf: 'flex-end',
                padding: '12px 16px',
                backgroundColor: '#F5F5F5',
                color: '#333333',
                borderRadius: '15px',
                border: '1px solid #DDDDDD'
              }}
            >
              {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </>,
    modalElement
  );
};
