import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Create a div that will be the modal container
  const modalRoot = document.getElementById('modal-root') || createModalRoot();
  
  // Create a div for this specific modal instance
  const el = React.useMemo(() => document.createElement('div'), []);
  
  // Add styles to ensure modal is on top
  useEffect(() => {
    if (isOpen) {
      // Apply styles to the modal element
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '0';
      el.style.right = '0';
      el.style.bottom = '0';
      el.style.zIndex = '2147483647'; // Max possible z-index
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      
      // Append the element to the modal root
      modalRoot.appendChild(el);
      
      // Add a class to the body to help with styling
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
      {children}
    </div>,
    el
  );
};

// Helper function to create the modal root if it doesn't exist
function createModalRoot() {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
  return modalRoot;
}
