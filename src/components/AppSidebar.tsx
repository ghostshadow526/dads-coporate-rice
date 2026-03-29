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
  Home
} from 'lucide-react';
import { auth } from '../firebase';
import { toast } from 'sonner';

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
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
    { id: 'documents', label: 'Documents', icon: FileText, path: '/dashboard?tab=documents' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/dashboard?tab=payments' },
    { id: 'home', label: 'Back to Home', icon: Home, path: '/' },
  ];

  return (
    <aside className="w-56 bg-black border-r border-white/10 hidden lg:flex flex-col fixed h-full z-20">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2 mb-8 group">
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

        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-4">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all text-sm ${
                location.pathname === item.path 
                  ? 'bg-green-900/30 text-green-400 font-bold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
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
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all text-sm ${
                location.pathname + location.search === item.path 
                  ? 'bg-green-900/30 text-green-400 font-bold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
