import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children, title }) => {
  // Create a div that will be the modal container
  const modalRoot = document.getElementById('modal-root') || createModalRoot();

  // Create a div for this specific modal instance
  const el = React.useMemo(() => document.createElement('div'), []);

  // Function to create the modal root if it doesn't exist
  function createModalRoot() {
    const root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
    return root;
  }

  React.useEffect(() => {
    if (isOpen) {
      // Add the modal element to the DOM
      modalRoot.appendChild(el);

      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');

      return () => {
        // Clean up when the component unmounts or when isOpen changes to false
        modalRoot.removeChild(el);
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
      };
    }
  }, [el, isOpen, modalRoot]);

  if (!isOpen) return null;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div
      className="modal-backdrop"
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
          padding: '30px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: '#333333'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo at the top with black background */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          backgroundColor: '#1E1E1E',
          padding: '15px 30px',
          borderRadius: '10px',
        }}>
          <img
            src="/assets/Buyer Breakthrough Logo.png"
            alt="Buyer Breakthrough Logo"
            style={{
              maxWidth: '200px',
              height: 'auto',
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666666',
            padding: '5px',
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {title}
        </h2>

        {/* Content */}
        {children}
      </div>
    </div>,
    el
  );
};
