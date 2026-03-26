import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Musa Ibrahim',
      role: 'Investor',
      content: 'The platform has completely changed how I view agricultural investments. The transparency and returns are exceptional.',
      image: 'https://picsum.photos/seed/musa/400/400',
      rating: 5,
    },
    {
      name: 'Chidi Okafor',
      role: 'Cooperative Member',
      content: 'Joining the SMCS cooperative was the best decision for my farming business. The support and collective bargaining power are invaluable.',
      image: 'https://picsum.photos/seed/chidi/400/400',
      rating: 5,
    },
    {
      name: 'Aisha Bello',
      role: 'Regular Customer',
      content: 'The quality of the rice is unmatched. It’s fresh, clean, and delicious. My family loves it!',
      image: 'https://picsum.photos/seed/aisha/400/400',
      rating: 4,
    },
    {
      name: 'Samuel Adeyemi',
      role: 'Training Participant',
      content: 'The training programs are very practical and insightful. I learned so much about modern farming techniques.',
      image: 'https://picsum.photos/seed/samuel/400/400',
      rating: 5,
    },
    {
      name: 'Fatima Yusuf',
      role: 'Investor',
      content: 'I love how easy it is to track my investments through the dashboard. The digital platform is very user-friendly.',
      image: 'https://picsum.photos/seed/fatima/400/400',
      rating: 5,
    },
    {
      name: 'Olawale Johnson',
      role: 'Cooperative Member',
      content: 'The monthly savings system in the cooperative has helped me manage my finances better. Highly recommended!',
      image: 'https://picsum.photos/seed/olawale/400/400',
      rating: 4,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop"
            alt="Testimonials"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 to-brand-dark"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            User Stories
          </motion.h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Hear from our community of investors, farmers, and customers.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-light p-10 rounded-3xl relative flex flex-col h-full"
              >
                <div className="absolute top-8 right-10 text-brand-green/10">
                  <Quote className="w-16 h-16" />
                </div>
                
                <div className="flex items-center space-x-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg mb-10 flex-grow italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-dark">{testimonial.name}</h3>
                    <p className="text-sm text-brand-green font-medium uppercase tracking-wider">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8">Share Your Experience</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-md mx-auto">
            We value your feedback! Tell us how our platform has impacted your life or business.
          </p>
          <button className="bg-brand-orange hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl">
            Submit a Testimonial
          </button>
        </div>
      </section>
    </div>
  );
}
