import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, db, doc, setDoc, Timestamp } from '../firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import type { UserProfile } from '../types';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked. Please allow popups for this site or try opening the app in a new tab.');
      } else {
        toast.error('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Sign up is a 2-step flow.
    if (!isLogin && signUpStep === 1) {
      if (!email.trim() || !password.trim() || !phoneNumber.trim()) {
        toast.error('Please enter email, password, and phone number.');
        return;
      }
      setSignUpStep(2);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Successfully logged in!');
      } else {
        if (!fullName.trim() || !address.trim() || !state.trim() || !city.trim()) {
          toast.error('Please complete your address details.');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName.trim() });

        const newProfile: UserProfile = {
          uid: userCredential.user.uid,
          displayName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          role: 'user',
          isUpgraded: false,
          createdAt: Timestamp.now(),
          walletBalance: 0,
        };

        // Merge in case the profile doc gets created elsewhere (e.g., App bootstrap).
        await setDoc(doc(db, 'users', userCredential.user.uid), newProfile, { merge: true });
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 pt-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
            alt="salvagebizhub Logo" 
            className="h-20 w-auto mx-auto mb-6"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Sign in to access your dashboard' : 'Join us to start your investment journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {!isLogin && signUpStep === 2 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                placeholder="Full Name"
              />
            </div>
          )}

          {(isLogin || signUpStep === 1) && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                placeholder="Email address (Gmail)"
              />
            </div>
          )}

          {(isLogin || signUpStep === 1) && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          )}

          {!isLogin && signUpStep === 1 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                placeholder="Phone Number"
              />
            </div>
          )}

          {!isLogin && signUpStep === 2 && (
            <>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                  placeholder="Address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                  placeholder="City"
                />
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                  placeholder="State"
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => setSignUpStep(1)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            </>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ 
              borderTopLeftRadius: "2rem",
              borderBottomRightRadius: "2rem",
              scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Processing...'
              : isLogin
                ? 'Sign In'
                : signUpStep === 1
                  ? 'Next'
                  : 'Create Account'}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 uppercase tracking-widest text-xs font-bold">Or continue with</span>
          </div>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          disabled={loading}
          whileHover={{ 
            borderTopLeftRadius: "2rem",
            borderBottomRightRadius: "2rem",
            scale: 1.02
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <LogIn className="h-5 w-5 text-gray-400 group-hover:text-green-500" aria-hidden="true" />
          </span>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </motion.button>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setSignUpStep(1);
            }}
            className="text-sm font-bold text-green-600 hover:text-green-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </motion.div>
    </div>
  );
}
