import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { UserIcon, LogOutIcon } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/register')}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 rounded-full bg-gray-800 p-1 text-white hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
          {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
            <p className="font-medium truncate">{user.email}</p>
          </div>
          <a
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Dashboard
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOutIcon size={16} className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
