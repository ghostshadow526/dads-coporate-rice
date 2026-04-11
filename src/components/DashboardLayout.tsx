import React from 'react';
import AppSidebar from './AppSidebar';
import { motion } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AppSidebar />
      <main className="flex-1 lg:ml-56 p-4 md:p-6 pt-20 lg:pt-6">
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
