import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function ProductsServicesSection() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number>(0);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Content & Dynamic Images */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">
                Our Products & Services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Whether it's working with rice farmers in Nigeria, sourcing high-quality grains, or producing value-added products, we help our customers around the world meet the increasing demand for food, feed and fibre.
              </p>
            </motion.div>

            {/* Dynamic Image Display */}
            <div className="relative h-[400px] w-full max-w-md mx-auto lg:mx-0 flex items-center justify-center">
              {services.map((service, idx) => (
                <motion.img
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: hoveredIndex === idx ? 1 : 0,
                    scale: hoveredIndex === idx ? 1 : 0.8,
                    y: hoveredIndex === idx ? 0 : 20,
                    zIndex: hoveredIndex === idx ? 20 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  src={service.image}
                  alt={service.title}
                  className="absolute w-full h-auto max-h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>

          {/* Right Side: Services List */}
          <div className="grid grid-cols-1 gap-8 pt-12">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(0)}
                onClick={() => setSelectedService(idx)}
                className="flex items-center space-x-6 group cursor-pointer"
              >
                <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center p-4 transition-all duration-300 ${hoveredIndex === idx ? 'bg-brand-orange border-brand-orange shadow-lg scale-110' : 'border-brand-orange bg-transparent'}`}>
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className={`w-full h-full object-contain transition-all ${hoveredIndex === idx ? 'brightness-0 invert' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`text-xl font-bold transition-all duration-300 ${hoveredIndex === idx ? 'text-brand-orange translate-x-2' : 'text-brand-dark'}`}>
                  {service.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Card Overlay */}
      <AnimatePresence>
        {selectedService !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Image Left */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50">
                <img 
                  src={services[selectedService].image} 
                  alt={services[selectedService].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bio Right */}
              <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-black text-brand-dark mb-6 uppercase tracking-tighter">
                  {services[selectedService].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {services[selectedService].bio}
                </p>
                <div className="mt-8">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
