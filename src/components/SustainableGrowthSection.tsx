import React from 'react';
import { motion } from 'motion/react';
import { ReadMore } from './ReadMore';
import { CheckCircle } from 'lucide-react';

export default function SustainableGrowthSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark leading-tight uppercase">
              Firm Foundations for <br />
              <span className="text-brand-orange">Sustainable Agricultural Growth</span>
            </h2>
            <div className="space-y-6">
              <p className="text-base font-bold text-gray-900 leading-relaxed">
                We are redefining agriculture and agribusiness by training and empowering our farmers with the tools, funding, and global market access they need to succeed in the agriculture industry.
              </p>
              
              <ReadMore maxHeight="0px" className="mt-0">
                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                  <p>
                    As an agribusiness and investment company, we operate at the intersection of agriculture, finance, and market intelligence. We understand that, success in today’s agricultural landscape goes beyond production, it requires clarity, strategy, and informed decision-making.
                  </p>
                  <p>
                    Over the years, we have built strong expertise by actively engaging across the agricultural value chain. This experience enables us to analyze market trends, understand consumer demand, and identify profitable opportunities with precision. We help our clients move beyond assumptions and make decisions grounded in real data and proven insights.
                  </p>
                  <p>
                    Whether you are a farmer, agro-processor, distributor, or investor, our role is to position you for success. We ensure that every initiative and investment is aligned with actual market demand, reducing risk, improving efficiency, and maximizing returns.
                  </p>
                  <p>
                    By working with us, or doing business with us, you gain more than a service, we provide you ideas to gain a trusted partner backed by years of hands-on experience and a deep understanding of the agribusiness landscape. We don’t just respond to the market; we help you understand it, navigate it, and grow within it.
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-brand-orange font-black text-xl italic">Salvage Biz-Hub</p>
                    <p className="text-gray-500 text-xs italic">... Creating wealth through Agriculture...</p>
                  </div>
                </div>
              </ReadMore>
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
                <h3 className="text-3xl md:text-6xl font-black text-white leading-tight uppercase">
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
