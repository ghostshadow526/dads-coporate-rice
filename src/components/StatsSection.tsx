import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';

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
              We offer our customers <br />
              <span className="text-brand-orange">a deeper understanding</span> of market needs.
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed max-w-xl">
              <p>
                We have over 35 years of experience in supply chains across the world with foundations built from our on-the-ground presence in Asia and Africa.
              </p>
              <p>
                Our operating capabilities in global origination, processing, trading, logistics, distribution, and risk management set us apart from our peers. While our strategic manufacturing assets in key destination markets strengthen our service to customers.
              </p>
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
                <Counter value={60} />
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
                <Counter value={10600} />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Customers
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
                <Counter value={35} suffix="+" />
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
                <Counter value={10000} suffix="+" />
              </div>
              <p className="text-lg font-bold text-white leading-tight">
                Employees
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
