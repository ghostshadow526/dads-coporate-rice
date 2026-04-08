import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { ReadMore } from './ReadMore';
import { CheckCircle } from 'lucide-react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter = ({ value, suffix = "", duration = 2 }: CounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    return num.toLocaleString() + suffix;
  });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: duration, ease: "easeOut" });
    }
  }, [inView, count, value, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default function StatsSection() {
  return (
    <section className="bg-[#1A1A1A] py-24 text-white overflow-hidden" id="capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 tracking-tight">
              Firm Foundations for <br />
              <span className="text-brand-orange">Sustainable Agricultural</span> Growth.
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed max-w-2xl">
              <p className="text-white font-bold text-xl">
                At the core of our mission is a commitment to delivering more than just products or capital, we provide insight. With over 8 years of experience since our establishment in 2018, we have consistently empowered our customers and partners with a deeper, more practical understanding of real market needs.
              </p>
              
              <ReadMore maxHeight="0px" gradientColor="from-[#1A1A1A]" className="mt-0">
                <div className="space-y-6">
                  <p>
                    At the core of our mission is a commitment to building a sustainable agricultural ecosystem that supports farmers, strengthens food security, and drives economic growth. We connect farmers, buyers, and partners across our global supply chain to ensure efficient distribution of food, feed, and fibre worldwide.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Empowering our Farmers with Finance and Opportunity</h3>
                    <p>
                      We provide smallholder and commercial farmers with access to agricultural finance, enabling them to invest in quality inputs, improve productivity, and scale their operations.
                    </p>
                    <p className="font-bold text-brand-orange">Through our farming cooperative platform (SALVAGE MULTIPURPOSE COOPERATIVE SOCIETY), farmers can:</p>
                    <ul className="space-y-2">
                      {[
                        "Secure funding for farming activities",
                        "Produce export-quality crops that meet international standards",
                        "Earn in foreign exchange (hard currency)",
                        "Build sustainable and profitable farming businesses"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Our approach helps reduce unemployment, improve rural livelihoods, and contribute to national food security and economic development.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Access to Global Agricultural Markets</h3>
                    <p>We eliminate one of the biggest challenges in agriculture, market access.</p>
                    <p className="font-bold text-brand-orange">Our farmers benefit from direct connections to reliable local and international buyers (off-takers), ensuring:</p>
                    <ul className="space-y-2">
                      {[
                        "Guaranteed demand for our farm produce",
                        "Competitive pricing in global markets",
                        "Reduced post-harvest losses",
                        "Increased profitability in agribusiness"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>By bridging the gap between farmers and buyers, we make farming more attractive, secure, and rewarding.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Modern Farming Techniques for Higher Yields</h3>
                    <p>We train farmers in modern, climate-smart agricultural practices designed to:</p>
                    <ul className="space-y-2">
                      {[
                        "Reduce production costs",
                        "Increase crop yield and quality",
                        "Improve efficiency and sustainability",
                        "Maximize return on farmers investment"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Our training programs ensure farmers stay competitive in today’s global agricultural industry.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Mechanized Farming for Large-Scale Production</h3>
                    <p>We support farmers in transitioning from traditional methods to mechanized farming systems.</p>
                    <p className="font-bold text-brand-orange">With access to affordable agricultural machinery, farmers can:</p>
                    <ul className="space-y-2">
                      {[
                        "Expand into large-scale commercial farming",
                        "Improve operational efficiency",
                        "Reduce manual labor and production time",
                        "Increase output and profitability"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Mechanization is key to achieving sustainable agricultural growth and long-term success.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Why Choose Our Agricultural Cooperative?</h3>
                    <ul className="space-y-2">
                      {[
                        "Access to farm financing and agribusiness support",
                        "Training in modern and sustainable farming practices",
                        "Direct market linkage to local and international buyers",
                        "Opportunity to earn in foreign currency through export markets",
                        "Support for farm mechanization and expansion"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Join the Future of Agriculture</h3>
                    <p>Whether you are a farmer, investor, or agribusiness partner, we provide the platform you need to succeed in today’s evolving agricultural landscape.</p>
                    <p className="text-brand-orange font-black text-xl italic">Join us today and grow your income, scale your farm, and access global markets.</p>
                  </div>
                </div>
              </ReadMore>
            </div>
          </motion.div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/media_1718d8590dcb1ccca87b761bfe93fa6428c6afcef.webp" 
                alt="Manufacturing Icon" 
                className="w-24 h-24 mb-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-5xl font-black text-[#A881FF] mb-2">
                <Counter value={3} />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Manufacturing & Processing <br /> Facilities
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/customers.webp" 
                alt="Customers Icon" 
                className="w-24 h-24 mb-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-5xl font-black text-brand-yellow mb-2">
                <Counter value={8000} suffix="+" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Customers across the world
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/countries.webp" 
                alt="Countries Icon" 
                className="w-24 h-24 mb-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-5xl font-black text-[#FF6B9E] mb-2">
                <Counter value={10} suffix="+" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Countries
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col"
            >
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/10%2C000%2B%20employess.webp" 
                alt="Employees Icon" 
                className="w-24 h-24 mb-6 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-5xl font-black text-[#00C2FF] mb-2">
                <Counter value={100} suffix="+" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Over 100+ employees <br /> across the branches
              </p>
            </motion.div>
          </div>
        </div>

        {/* Image & Transformation Section */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Clean Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-video overflow-hidden rounded-[60px] rounded-tr-none rounded-bl-none shadow-2xl">
              <img 
                src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/IMG-20230113-WA0046.jpg.jpeg" 
                alt="Cultivating Transformation" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Right: Text Content (Smaller Size) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
              Cultivating <br />
              <span className="text-[#FF6B9E]">Transformation</span>
            </h3>
            <div className="space-y-4 text-base text-gray-400 leading-relaxed max-w-md">
              <p>
                We're a trusted partner across multiple supply chains. We unlock value for customers, enable farming communities to prosper sustainably and strive for a food-secure future.
              </p>
              <p>
                Learn more about how, where, and what we transform, in our video.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
