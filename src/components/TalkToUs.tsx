import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function TalkToUs() {
  return (
    <section className="relative bg-[#222222] pt-32 pb-24 overflow-hidden">
      {/* Curved Top Border */}
      <div 
        className="absolute top-0 left-0 w-full h-24 bg-white"
        style={{
          clipPath: 'ellipse(70% 100% at 50% 0%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <img 
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/talk%20to%20us.webp" 
            alt="Talk to Us Icon" 
            className="w-24 h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white mb-6"
        >
          Talk to Us
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          Whether you're interested in speaking to our country management team, enquiring about one of our products or partnering with us, we want to hear from you.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/contact"
            className="inline-block bg-white text-brand-dark px-12 py-4 rounded-md font-bold hover:bg-gray-100 transition-all shadow-xl"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Bottom Orange Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange" />
    </section>
  );
}
