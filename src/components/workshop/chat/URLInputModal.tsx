import React, { useState } from 'react';
import { X, Link, FileText, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { createPortal } from 'react-dom';

interface URLInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contextType: 'url' | 'text', contextValue: string) => void;
  isLoading?: boolean;
}

export const URLInputModal: React.FC<URLInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

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
  React.useEffect(() => {
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

  const handleSubmit = () => {
    // Validate input
    if (!inputValue.trim()) {
      setError('Please enter a value');
      return;
    }

    // For URL type, validate URL format
    if (inputType === 'url') {
      try {
        // Simple URL validation
        new URL(inputValue);
      } catch (e) {
        setError('Please enter a valid URL (including http:// or https://)');
        return;
      }
    }

    // Clear error and submit
    setError('');
    onSubmit(inputType, inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#333333' }}>
            Help me brainstorm with my information
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={20} color="#AAAAAA" />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px 24px',
          flex: 1,
          overflowY: 'auto'
        }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', lineHeight: 1.6, color: '#555555' }}>
            I can help you brainstorm scalable offer ideas based on your expertise. Please provide either a URL (like your LinkedIn profile or website) or paste some text about your background.
          </p>

          {/* Input Type Selector */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setInputType('url')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: inputType === 'url' ? '#FFDD00' : '#EEEEEE',
                backgroundColor: inputType === 'url' ? '#FFFBEB' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Link size={24} color={inputType === 'url' ? '#333333' : '#999999'} />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: inputType === 'url' ? 600 : 400,
                color: inputType === 'url' ? '#333333' : '#666666'
              }}>
                URL
              </span>
            </button>
            <button
              onClick={() => setInputType('text')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid',
                borderColor: inputType === 'text' ? '#FFDD00' : '#EEEEEE',
                backgroundColor: inputType === 'text' ? '#FFFBEB' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FileText size={24} color={inputType === 'text' ? '#333333' : '#999999'} />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: inputType === 'text' ? 600 : 400,
                color: inputType === 'text' ? '#333333' : '#666666'
              }}>
                Text
              </span>
            </button>
          </div>

          {/* Input Field */}
          {inputType === 'url' ? (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="url-input"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333'
                }}
              >
                Enter your LinkedIn profile or website URL:
              </label>
              <input
                id="url-input"
                type="url"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="https://www.linkedin.com/in/yourprofile/"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: error ? '#ef4444' : '#DDDDDD',
                  fontSize: '14px',
                  backgroundColor: '#F5F5F5',
                  color: '#333333'
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="text-input"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333333'
                }}
              >
                Describe your expertise, services, and target audience:
              </label>
              <textarea
                id="text-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="I'm a marketing consultant specializing in content strategy for SaaS companies. I help clients with content calendars, SEO optimization, and audience research..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: error ? '#ef4444' : '#DDDDDD',
                  fontSize: '14px',
                  minHeight: '120px',
                  resize: 'vertical',
                  backgroundColor: '#F5F5F5',
                  color: '#333333'
                }}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#ef4444',
              fontSize: '14px',
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              borderLeft: '3px solid #ef4444'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            style={{
              backgroundColor: 'transparent',
              color: '#666666',
              border: '1px solid #DDDDDD',
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              backgroundColor: '#FFDD00',
              color: 'black',
              borderRadius: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              'Generate Ideas'
            )}
          </Button>
        </div>
      </div>
    </div>,
    modalElement
  );
};
