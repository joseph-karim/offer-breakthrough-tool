import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#FFFFFF !important', background: '#FFFFFF !important' }} className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="py-3 px-4 text-center bg-white border-b border-gray-200" style={{ backgroundColor: '#FFFFFF !important' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <span className="font-medium text-black flex items-center">
            ✨ Get your FREE AI-powered Buyer Research Bot 🤖
          </span>
          <button className="mt-2 sm:mt-0 bg-black hover:bg-gray-800 text-yellow-300 px-4 py-1 rounded-full text-sm font-bold flex items-center border-2 border-black">
            Tell me more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '2px solid #FFDD00' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="font-display text-2xl font-bold flex items-center">
                <span style={{ color: '#222222' }} className="font-bold mr-2">WHY</span>
                <span style={{ color: '#222222' }} className="font-bold">WE</span>
                <span style={{ color: '#222222' }} className="font-bold block">BUY</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-8">
                <a 
                  href="#" 
                  className="font-semibold text-gray-800 hover:text-black"
                >
                  NEWSLETTER
                </a>
                <a 
                  href="#" 
                  className="font-semibold text-gray-800 hover:text-black flex items-center"
                >
                  PRODUCTS <span className="ml-1">👇</span>
                </a>
                <a 
                  href="#" 
                  className="bg-yellow-300 text-black px-4 py-2 rounded-md font-bold"
                >
                  PODCAST
                </a>
                <a 
                  href="#" 
                  className="bg-yellow-300 text-black px-4 py-2 rounded-md font-bold"
                >
                  ADVERTISE
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEEEE' }} className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} CustomerCamp. All rights reserved. ✨
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://customercamp.co/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black text-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="https://customercamp.co/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black text-sm"
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