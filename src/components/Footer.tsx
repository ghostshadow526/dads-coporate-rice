import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-white relative">
      {/* Top Orange Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          {/* Logo Section */}
          <div className="md:col-span-3">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
                alt="Salvage Biz-Hub Logo" 
                className="h-16 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black leading-none tracking-tighter">SALVAGE</span>
                <span className="text-2xl font-black leading-none tracking-tighter">BIZHUB</span>
              </div>
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-4 text-sm text-gray-300">
                <li><Link to="/careers" className="hover:text-brand-orange transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link></li>
                <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
                <li><Link to="/locations" className="hover:text-brand-orange transition-colors">Locations</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              </ul>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><Link to="/cookies" className="hover:text-brand-orange transition-colors">Cookie Policy</Link></li>
                <li><Link to="/sitemap" className="hover:text-brand-orange transition-colors">Sitemap</Link></li>
                <li><Link to="/terms" className="hover:text-brand-orange transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Products & Services */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">Products & Services</h4>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-4 text-sm text-gray-300">
                <li><Link to="/grains" className="hover:text-brand-orange transition-colors">Grains & Oilseeds</Link></li>
                <li><Link to="/risk-management" className="hover:text-brand-orange transition-colors">Risk Management Solutions</Link></li>
                <li><Link to="/cotton" className="hover:text-brand-orange transition-colors">Cotton</Link></li>
                <li><Link to="/edible-oils" className="hover:text-brand-orange transition-colors">Edible Oils</Link></li>
                <li><Link to="/rice" className="hover:text-brand-orange transition-colors">Rice</Link></li>
              </ul>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><Link to="/rubber" className="hover:text-brand-orange transition-colors">Rubber</Link></li>
                <li><Link to="/specialty-grains" className="hover:text-brand-orange transition-colors">Specialty Grains & Seeds</Link></li>
                <li><Link to="/animal-feed" className="hover:text-brand-orange transition-colors">Animal Feed & Protein</Link></li>
                <li><Link to="/wood" className="hover:text-brand-orange transition-colors">Wood Products</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">Social</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-brand-orange transition-colors">
                  <div className="bg-white p-1 rounded-sm">
                    <Linkedin className="w-4 h-4 text-[#222222]" />
                  </div>
                  <span className="font-bold">SalvageBizHub</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-brand-orange transition-colors">
                  <div className="bg-white p-1 rounded-sm">
                    <Twitter className="w-4 h-4 text-[#222222]" />
                  </div>
                  <span className="font-bold">SalvageBizHub_</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-center items-center pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 font-bold">
            © {new Date().getFullYear()} Salvage Biz-Hub Nig. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Manage Cookies Button */}
      <div className="absolute bottom-0 left-0">
        <motion.button 
          whileHover={{ 
            borderTopRightRadius: "20px",
            scale: 1.05
          }}
          transition={{ duration: 0.3 }}
          className="bg-white text-brand-orange px-4 py-2 text-xs font-bold border-t border-r border-brand-orange"
        >
          Manage Cookies
        </motion.button>
      </div>
    </footer>
  );
}
