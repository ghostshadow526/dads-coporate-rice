import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20260116-WA0004.jpg-removebg-preview.png" 
                alt="salvagebizhub Logo" 
                className="h-14 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering communities through sustainable agriculture and cooperative growth. Join us in our mission to provide quality rice and investment opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-green-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-500 transition-colors">About Us</Link></li>
              <li><Link to="/login" className="hover:text-green-500 transition-colors">Investor Login</Link></li>
              <li><Link to="/cooperative" className="hover:text-green-500 transition-colors">Join Cooperative (SMCS)</Link></li>
              <li><Link to="/buy-rice" className="hover:text-green-500 transition-colors">Buy Rice</Link></li>
              <li><Link to="/training" className="hover:text-green-500 transition-colors">Register for Training</Link></li>
              <li><Link to="/testimonials" className="hover:text-green-500 transition-colors">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span>123 Rice Farm Road, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span>+234 800 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span>info@salvagebizhub.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500 transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-green-500 transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="hover:text-green-500 transition-colors"><Instagram className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} salvagebizhub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
