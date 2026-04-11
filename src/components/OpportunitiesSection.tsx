import React from 'react';
import { motion } from 'motion/react';

export default function OpportunitiesSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 items-center">
          {/* Left Side: Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video w-full rounded-tr-[120px] rounded-bl-[120px] overflow-hidden shadow-2xl"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://ik.imagekit.io/lwr4hqcxw/agile.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 pl-0 lg:pl-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#222222] leading-tight uppercase">
              Creating Opportunities <br />
              to <span className="text-brand-blue">Make a Difference</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              <p>
                We empower you to imagine extraordinary answers to the world's everyday food supply challenges, fulfilling your own ambitions and positively influencing our global business and the world around us.
              </p>
              <p>
                Our values encourage colleagues to rise to the challenge, take ownership of decisions, and explore new ways of doing things.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
