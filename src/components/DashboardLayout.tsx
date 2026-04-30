import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import MobileSidebar from './MobileSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AppSidebar />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 lg:ml-56 p-4 md:p-6 pt-20 lg:pt-6">
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#F8F9FA]/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-gray-200">
          <a href="/" className="font-bold text-lg">Salvage Biz-Hub</a>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
