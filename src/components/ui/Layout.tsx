import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E', color: 'white' }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer style={{ backgroundColor: '#1E1E1E', borderTop: '1px solid #333333' }} className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CustomerCamp. All rights reserved. ✨
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://customercamp.co/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="https://customercamp.co/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-300 text-sm"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;