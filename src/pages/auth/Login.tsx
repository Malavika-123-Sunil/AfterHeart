import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const from = state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <Link to="/" className="absolute top-6 left-6 flex items-center text-accent-700 hover:text-primary-600 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center">
                <Heart className="text-secondary-500" size={32} />
              </div>
              <h1 className="text-2xl font-display font-bold text-primary-800 mt-4">
                Welcome Back
              </h1>
              <p className="text-accent-600 mt-2">
                You're not alone. Let's heal together.
              </p>
            </div>
            
            {error && (
              <div className="bg-error-50 text-error-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-accent-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-accent-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-accent-700">
                      Password
                    </label>
                    <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-accent-500" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Sign In'}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-accent-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-accent-100">
              <p className="text-xs text-accent-500 text-center">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <footer className="py-6 text-center text-accent-600 text-sm">
        <p>© 2025 AfterHeart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;