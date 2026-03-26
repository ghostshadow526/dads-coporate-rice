import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
            alt="DAD’s RICE Logo" 
            className="h-24 w-auto mx-auto mb-6"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm">Sign in to access your dashboard and services.</p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-gray-400 group-hover:text-green-500" aria-hidden="true" />
            </span>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <div className="text-center text-xs text-gray-500 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
