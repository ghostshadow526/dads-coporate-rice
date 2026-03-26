import { Link, useNavigate } from 'react-router-dom';
import { auth, logout, FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import { Menu, X, User, LogOut, ChevronDown, Search, MapPin, MessageSquare, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Products & Services', path: '/products' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'News', path: '/news' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white text-[13px] py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center space-x-8">
          <button className="flex items-center hover:text-brand-yellow transition-colors">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Us
          </button>
          <button className="flex items-center hover:text-brand-yellow transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </button>
          <button className="flex items-center hover:text-brand-yellow transition-colors">
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
          <button className="bg-white text-black px-4 py-2 flex items-center font-bold hover:bg-gray-100 transition-colors -my-2">
            <Mail className="w-4 h-4 mr-2" />
            Subscribe
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-brand-orange shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img 
                    src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
                    alt="Logo" 
                    className="h-8 w-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-white text-2xl font-bold tracking-tight">DAD'S RICE</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white hover:text-brand-yellow font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:text-brand-yellow focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{profile?.displayName?.split(' ')[0] || 'User'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                      >
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-white border-2 border-white/30 hover:border-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-brand-yellow focus:outline-none"
              >
                {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>

          {/* Breadcrumbs - Only on Home Page and Desktop */}
          {window.location.pathname === '/' && (
            <div className="hidden md:flex items-center space-x-2 text-white/70 text-xs py-2">
              <Link to="/products" className="hover:text-white transition-colors">Products & Services</Link>
              <span>›</span>
              <span className="text-white">Rice</span>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-brand-orange z-50 flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsOpen(false)} className="text-white">
                <X className="w-10 h-10" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white text-3xl font-black uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="text-white text-3xl font-black uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-white text-3xl font-black uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>

            <div className="mt-auto pt-12 border-t border-white/20 flex flex-col space-y-6">
              <button className="flex items-center text-white font-bold">
                <MessageSquare className="w-6 h-6 mr-4" />
                Contact Us
              </button>
              <button className="flex items-center text-white font-bold">
                <MapPin className="w-6 h-6 mr-4" />
                Locations
              </button>
              <button className="bg-white text-brand-orange px-8 py-4 rounded-full font-black text-center uppercase tracking-widest">
                Subscribe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
