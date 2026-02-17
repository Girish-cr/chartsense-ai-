
import React, { useState } from 'react';
import { AppLogo, LoadingIcon } from './icons';

interface AuthPageProps {
  onAuthComplete: (user: { email: string }) => void;
  onClose: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthComplete, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete({ email });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="-translate-y-1">
                <AppLogo />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ChartSense</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isLogin ? 'Please enter your details to sign in.' : 'Start your journey with ChartSense AI today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none text-gray-900"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none text-gray-900"
                placeholder="••••••••"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingIcon />
                  <span>Processing...</span>
                </>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium mb-4">Or continue with</p>
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-600 font-medium"
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <span className="text-cyan-600 font-bold hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
