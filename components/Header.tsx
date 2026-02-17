
import React from 'react';
import { AppLogo } from './icons';

interface HeaderProps {
  user: { email: string } | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onLogout }) => {
  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        
        {/* Brand Group */}
        <div className="flex items-center gap-3">
            <div className="transform scale-90 -translate-y-1">
                <AppLogo />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">
              ChartSense <span className="text-cyan-600">AI</span>
            </h1>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button 
                onClick={onAuthClick}
                className="hidden sm:block text-gray-600 font-semibold hover:text-cyan-600 transition-colors px-4 py-2"
              >
                Log In
              </button>
              <button 
                onClick={onAuthClick}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-cyan-600/10 transition-all active:scale-[0.98]"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-bold text-gray-900">{user.email.split('@')[0]}</p>
                <p className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Pro Member</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold border-2 border-white shadow-sm hover:bg-cyan-200 transition-colors"
              >
                {user.email[0].toUpperCase()}
              </button>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};
