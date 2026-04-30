import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  User, 
  TrendingUp, 
  ShoppingBag, 
  GraduationCap, 
  CheckCircle,
  LogOut,
  Home,
  Wallet,
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
      onClose();
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'invest', label: 'Invest', icon: TrendingUp, path: '/invest' },
    { id: 'cooperative', label: 'Cooperative', icon: CheckCircle, path: '/cooperative' },
    { id: 'buy-rice', label: 'Buy Rice', icon: ShoppingBag, path: '/buy-rice' },
    { id: 'training', label: 'Training', icon: GraduationCap, path: '/training' },
  ];

  const secondaryItems = [
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard?tab=profile' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/dashboard?tab=wallet' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/dashboard?tab=documents' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/dashboard?tab=payments' },
    { id: 'home', label: 'Back to Home', icon: Home, path: '/' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 bg-black border-r border-white/10 flex flex-col fixed h-full z-50 lg:hidden"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={onClose} className="flex items-center space-x-2 group">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                    <img 
                      src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
                      alt="Salvage Biz-Hub Ltd Logo" 
                      className="w-full h-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight text-white leading-tight">Salvage Biz-Hub</span>
                    <span className="text-[10px] text-gray-400 font-medium">Limited</span>
                  </div>
                </Link>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-4">Main Menu</p>
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-base ${
                      location.pathname === item.path 
                        ? 'bg-green-900/30 text-green-400 font-bold' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <nav className="mt-8 space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-4">Account</p>
                {secondaryItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-base ${
                      location.pathname + location.search === item.path 
                        ? 'bg-green-900/30 text-green-400 font-bold' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all text-base"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
