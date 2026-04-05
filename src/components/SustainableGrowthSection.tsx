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
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark leading-tight">
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
                    At the core of our mission is a commitment to building a sustainable agricultural ecosystem that supports farmers, strengthens food security, and drives economic growth. We connect farmers, buyers, and partners across our global supply chain to ensure efficient distribution of food, feed, and fibre worldwide.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Empowering our Farmers with Finance and Opportunity</h3>
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
                          <CheckCircle className="w-4 h-4 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Our approach helps reduce unemployment, improve rural livelihoods, and contribute to national food security and economic development.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Access to Global Agricultural Markets</h3>
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
                          <CheckCircle className="w-4 h-4 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>By bridging the gap between farmers and buyers, we make farming more attractive, secure, and rewarding.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Modern Farming Techniques for Higher Yields</h3>
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

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Mechanized Farming for Large-Scale Production</h3>
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
                          <CheckCircle className="w-4 h-4 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p>Mechanization is key to achieving sustainable agricultural growth and long-term success.</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Why Choose Our Agricultural Cooperative?</h3>
                    <ul className="space-y-2">
                      {[
                        "Access to farm financing and agribusiness support",
                        "Training in modern and sustainable farming practices",
                        "Direct market linkage to local and international buyers",
                        "Opportunity to earn in foreign currency through export markets",
                        "Support for farm mechanization and expansion"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-brand-green mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-black text-brand-dark uppercase tracking-tighter">Join the Future of Agriculture</h3>
                    <p>Whether you are a farmer, investor, or agribusiness partner, we provide the platform you need to succeed in today’s evolving agricultural landscape.</p>
                    <p className="text-brand-orange font-black text-lg italic">Join us today and grow your income, scale your farm, and access global markets.</p>
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
