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
              Our Products &amp; Services
            </h2>
            <div className="space-y-6">
              <p className="text-base font-bold text-gray-900 leading-relaxed">
                We are redefining agriculture and agribusiness by training and empowering our farmers with the tools, funding, and global market access they need to succeed in the agriculture industry.
              </p>

              <ReadMore maxHeight="0px" className="mt-0">
                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                  <p>
                    Whether partnering with rice farmers in Nigeria, sourcing premium-quality grains, or producing value-added products, we help customers around the world meet the rising demand for food, feed, and fibre.
                  </p>
                  <p>
                    At the heart of our operations is a commitment to strengthening food systems, food security, empowering farmers, and delivering high-quality agricultural products that meet global standards. From farm to market, we create value across the entire supply chain, ensuring efficiency, sustainability, and profitability for all stakeholders.
                  </p>
                  <p>
                    We work closely with rice farmers and agricultural communities across Nigeria, providing support, market access, and structured partnerships that enhance productivity and livelihoods. Through responsible sourcing, we aggregate premium-quality grains and raw materials that meet both local and international demand.
                  </p>
                  <p>
                    Beyond sourcing, we specialize in processing and value addition, transforming raw agricultural produce into high-quality finished and semi-finished products. Our processing capabilities are designed to reduce post-harvest losses, improve product quality, and increase market competitiveness, ensuring that nothing goes to waste and every output delivers maximum value.
                  </p>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h3 className="font-black text-brand-dark text-base uppercase tracking-tight">Why Partner With Us</h3>
                    <p>We are more than a supplier, we are a strategic partner.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold">Outsourcing Solutions:</span> Businesses can rely on us for efficient sourcing, aggregation, and processing, allowing them to focus on core operations while we handle the supply chain complexities.
                      </li>
                      <li>
                        <span className="font-semibold">Bridging Food Security Gaps:</span> By connecting farmers to markets and improving production and processing systems, we actively contribute to reducing food shortages and stabilizing supply.
                      </li>
                      <li>
                        <span className="font-semibold">Economic Growth &amp; Empowerment:</span> Our model supports job creation, increases farmer incomes, and strengthens local economies, driving sustainable financial growth across communities.
                      </li>
                      <li>
                        <span className="font-semibold">Global Standards, Local Impact:</span> We combine international best practices with deep local expertise to deliver products that meet global quality requirements while uplifting local producers.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h3 className="font-black text-brand-dark text-base uppercase tracking-tight">Our Vision in Action</h3>
                    <p>
                      As demand for food, feed, and fibre continues to rise globally, we position ourselves as a reliable bridge between production and consumption. By fostering partnerships, investing in processing, and optimizing distribution, we ensure that quality agricultural products reach the right markets at the right time.
                    </p>
                    <p>
                      Partner with us today, whether you are looking to outsource, source premium agricultural products, or collaborate in building a more secure and prosperous food system. Together, we can drive impact, scale opportunity, and shape the future of agriculture.
                    </p>
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
