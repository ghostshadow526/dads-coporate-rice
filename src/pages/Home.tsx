import { motion } from 'motion/react';
import { ArrowRight, Globe, Leaf, Droplets, Zap, TrendingUp, Users, ShieldCheck, Map, Clock, CheckCircle, Headphones, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsSection from '../components/StatsSection';
import ProductsServicesSection from '../components/ProductsServicesSection';
import SustainableGrowthSection from '../components/SustainableGrowthSection';
import OpportunitiesSection from '../components/OpportunitiesSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-Width Brand Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[140vh] bg-brand-orange overflow-hidden">
        {/* Top Right Image - Masked like the guide */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 right-0 w-[40%] h-[50%] z-0"
          style={{
            clipPath: 'ellipse(100% 100% at 100% 0%)',
          }}
        >
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/Untitled%20design%20(1).png"
            alt="Salvage Biz-Hub Design 1"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Bottom Right Image - Masked like the guide */}
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-0 right-0 w-[30%] h-[40%] z-0"
          style={{
            clipPath: 'ellipse(100% 100% at 100% 100%)',
          }}
        >
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/ChatGPT%20Image%20Mar%2026%2C%202026%2C%2009_08_34%20AM.png"
            alt="Salvage Biz-Hub Design 2"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Bottom Left Image - Masked like the guide */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-[30%] h-[55%] z-0"
          style={{
            clipPath: 'ellipse(100% 100% at 0% 100%)',
          }}
        >
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/Screenshot_2026-03-26_082017-removebg-preview.png"
            alt="Rice Stalks"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] mb-4 tracking-tighter flex flex-col items-center uppercase">
              <span className="text-brand-dark">Salvage Biz-Hub</span>
              <span className="text-white">Nig. Ltd</span>
            </h1>
            <div className="flex flex-col items-center space-y-2">
              <p className="text-base md:text-lg text-white font-bold uppercase tracking-[0.25em]">
                non-oil sector · agribusiness · global partnerships
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section - Bank Ticker Style */}
      <div className="bg-black py-4 overflow-hidden border-y border-white/5">
        <div className="relative flex">
          <div className="flex animate-marquee-reverse whitespace-nowrap items-center">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center px-8 border-r border-white/10">
                  <Users className="h-4 w-4 text-brand-yellow mr-3" />
                  <span className="text-white text-lg font-bold mr-2">30,000+</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Farmers trained</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <TrendingUp className="h-4 w-4 text-brand-green mr-3" />
                  <span className="text-white text-lg font-bold mr-2">38%</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">ROI (12–36mo)</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <Clock className="h-4 w-4 text-brand-orange mr-3" />
                  <span className="text-white text-lg font-bold mr-2">6 mo</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Partial Maturity</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <ShieldCheck className="h-4 w-4 text-brand-blue mr-3" />
                  <span className="text-white text-lg font-bold mr-2">2,347+</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Active Investors</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <Map className="h-4 w-4 text-brand-pink mr-3" />
                  <span className="text-white text-lg font-bold mr-2">637+</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Hectares</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <Globe className="h-4 w-4 text-brand-yellow mr-3" />
                  <span className="text-white text-lg font-bold mr-2">15+</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Global Partners</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <CheckCircle className="h-4 w-4 text-brand-green mr-3" />
                  <span className="text-white text-lg font-bold mr-2">100%</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Traceability</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <Briefcase className="h-4 w-4 text-brand-blue mr-3" />
                  <span className="text-white text-lg font-bold mr-2">12+</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Active Projects</span>
                </div>
                <div className="flex items-center px-8 border-r border-white/10">
                  <Headphones className="h-4 w-4 text-brand-orange mr-3" />
                  <span className="text-white text-lg font-bold mr-2">24/7</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Support</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StatsSection />
      <ProductsServicesSection />
      <SustainableGrowthSection />
      <OpportunitiesSection />
    </div>
  );
}
