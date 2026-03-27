import React from 'react';
import { motion } from 'motion/react';

export default function SustainableGrowthSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark leading-tight">
              Firm Foundations for <br />
              <span className="text-brand-orange">Sustainable Growth</span>
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                We offer our farmers, our customers and every member of our global supply chains, a robust, and forward-looking approach to worldwide food, feed and fibre distribution.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our global practices are firmly rooted in experience and understanding second to none.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/sky2.png" 
              alt="Sustainable Growth" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>

      {/* New Extended Section - Moved outside to be wider */}
      <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] md:h-[750px] w-full rounded-tr-[120px] rounded-bl-[120px] overflow-hidden group shadow-2xl"
        >
          {/* Background Image */}
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/strive.webp" 
            alt="Food-Secure Future" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              {/* Left Text */}
              <div>
                <h3 className="text-3xl md:text-6xl font-black text-white leading-tight">
                  Striving for a <br />
                  <span className="text-brand-yellow">Food-Secure Future</span>
                </h3>
              </div>
              
              {/* Right Text */}
              <div className="max-w-xl">
                <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                  As a purpose-driven business, we're contributing positively to improving the prosperity and well-being of people across our supply chains, protecting and regenerating our natural resources, and tackling climate change.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
