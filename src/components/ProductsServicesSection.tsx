import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';

export default function ProductsServicesSection() {
  const [selectedService, setSelectedService] = React.useState<number | null>(null);

  const services = [
    {
      title: "Rice",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20icon.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20img.jpeg",
      bio: "Premium quality rice sourced from local Nigerian farmers, processed with the highest standards to ensure nutritional value and great taste. We bridge the gap between farm and table."
    },
    {
      title: "DAD'S SALAVAGE RICE ",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/bag.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20img2.jpeg",
      bio: "Our signature brand of parboiled rice, known for its unique aroma, long grains, and superior cooking quality. A favorite for families across the region, DAD'S SALVAGE RICE represents our commitment to excellence."
    },
    {
      title: "Risk Management Solutions",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20icon.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/risk%20management.webp",
      bio: "Comprehensive risk assessment and management strategies for agricultural investments, ensuring sustainability and protecting our partners' interests in a dynamic global market."
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight uppercase">
              Our Products & Services
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-6 text-left md:text-center">
              <p>
                At the core of our mission is a commitment to delivering more than just products or capital, we provide insight. With over 8 years of experience since our establishment in 2018, we have consistently empowered our customers with a deeper, more practical understanding of real market needs.
              </p>
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
              <div className="pt-4">
                <p className="font-black text-brand-dark uppercase tracking-tighter text-xl">Salvage Biz-Hub</p>
                <p className="text-brand-orange font-bold italic">... Creating wealth through Agriculture ...</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid - Styled like Board of Directors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Image Container with Custom Border Radius */}
              <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden rounded-tl-[60px] rounded-br-[60px] bg-gray-100 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Icon Overlay */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <img 
                    src={service.icon} 
                    alt="Icon" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-black text-brand-dark mb-4 uppercase tracking-tighter">
                {service.title}
              </h3>
              
              <motion.button
                onClick={() => setSelectedService(idx)}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="text-sm font-bold text-brand-orange hover:text-brand-dark transition-colors flex items-center space-x-2 bg-brand-orange/10 px-6 py-2 rounded-full"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Card Overlay - Styled like Board of Directors Modal */}
      <AnimatePresence>
        {selectedService !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
              onClick={() => setSelectedService(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-dark hover:text-brand-orange transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Left */}
              <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto bg-gray-50">
                <img 
                  src={services[selectedService].image} 
                  alt={services[selectedService].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content Right */}
              <div className="flex-1 p-8 md:p-16 overflow-y-auto max-h-[60vh] md:max-h-none flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-xl p-2">
                    <img 
                      src={services[selectedService].icon} 
                      alt="Icon" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tighter">
                    {services[selectedService].title}
                  </h3>
                </div>
                
                <div className="w-12 h-1 bg-brand-orange mb-8" />
                
                <div className="prose prose-lg text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    {services[selectedService].bio}
                  </p>
                </div>

                <div className="mt-12">
                  <motion.button 
                    whileHover={{ 
                      borderTopLeftRadius: "30px",
                      borderBottomRightRadius: "30px",
                      scale: 1.05
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={() => setSelectedService(null)}
                    className="bg-brand-orange text-white px-10 py-4 rounded-full font-bold hover:bg-brand-dark transition-colors shadow-xl"
                  >
                    Close Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
