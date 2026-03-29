import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Mr. Ibrahim Musa',
      role: 'Long-Term Investor, Abuja',
      content: 'I started investing with Salvage Biz-Hub Ltd about five years ago when their farming investment program was first introduced to me. At first, I thought to invest a small amount just to test the credibility of the company, I took great decision and invested on 5 hecters. Today, I can confidently say that it was one of the best financial decisions I have made. My investment has grown consistently, and the returns have helped me buy a car, support my family and expand my personal business. Despite the economic challenges in Nigeria, Salvage Biz-Hub has continued to honor their ROI commitments. Their transparency and integrity are what make them stand out.',
      image: 'https://picsum.photos/seed/ibrahim/400/400',
      rating: 5,
    },
    {
      name: 'James Whitmore',
      role: 'UK Investor, London',
      content: 'Before committing capital, I carried out extensive due diligence on your rice farming investment. What ultimately convinced me was the strength of your operational structure and the clarity of your reporting. Since investing, your team has consistently delivered on projected performance, with my returns. More importantly, the level of transparency and communication has remained exceptional. This is a professionally managed agribusiness that aligns well with long-term investment strategies.',
      image: 'https://picsum.photos/seed/james/400/400',
      rating: 5,
    },
    {
      name: 'Mrs. Grace Okafor',
      role: 'Investor, Lagos',
      content: 'For the past four years I have invested with Salvage Biz-Hub Ltd in their agricultural rice farm projects. What impressed me most is their honesty and accountability. In Nigeria today, many investment companies promise heaven and earth but fail to deliver. Salvage Biz-Hub has remained consistent in keeping their promises to me. Even during difficult economic periods, they still ensured i received my returns as agreed. That level of integrity is rare and truly commendable.',
      image: 'https://picsum.photos/seed/grace/400/400',
      rating: 5,
    },
    {
      name: 'Dr. Samuel Danladi',
      role: 'Investor, Jos',
      content: 'I joined Salvage Biz-Hub Ltd six years ago as one of their early agricultural investors. Over the years, my income has multiplied significantly through their structured farming investment program. The company manages the farming operations professionally while i only visited once a while to see because of distance and the nature of my work, i enjoy steady returns on my investment. Today, I have increased my investment three times because I trust their system and leadership.',
      image: 'https://picsum.photos/seed/samuel/400/400',
      rating: 5,
    },
    {
      name: 'Mrs. Halima Bello',
      role: 'Customer, Kaduna',
      content: 'The first time I bought DAD\'S RICE produced by Salvage Biz-Hub Ltd, I was surprised by the quality. The rice is very clean, stone-free, and cooks perfectly. My family now prefers DAD\'S RICE to many imported brands. It\'s not just rice; it\'s premium quality proudly produced in Nigeria. I highly recommend it to households and food businesses.',
      image: 'https://picsum.photos/seed/halima/400/400',
      rating: 5,
    },
    {
      name: 'Mr. Chinedu Nwankwo',
      role: 'Investor, Enugu',
      content: 'I have been investing with Salvage Biz-Hub Ltd for over three years now. What makes this company different to me is that they don\'t just promise profits to me, they deliver results. Every cycle of investment I have done with them has been successful, which is why I continue to reinvest. Their agricultural model is sustainable, and their management team is professional and trustworthy. The people I recommended too are happy, I am so excited to meet this company.',
      image: 'https://picsum.photos/seed/chinedu/400/400',
      rating: 5,
    },
    {
      name: 'Mrs. Blessing Adebayo',
      role: 'Food Vendor, Ibadan',
      content: 'As a food vendor, the quality of rice I use matters greatly. Since I started using DAD\'S RICE two years ago, my customers often compliment the natural taste and texture of my meals. The rice is clean, cooks well, and tastes natural. I am proud to support a Nigerian agricultural company producing such high-quality food.',
      image: 'https://picsum.photos/seed/blessing/400/400',
      rating: 5,
    },
    {
      name: 'Engr. Abdullahi Sani',
      role: 'Investor, Kaduna',
      content: 'What convinced me to continue investing with reinvesting with Salvage Biz-Hub in the past five years is the consistency in paying my ROI as at when due. Agriculture can be challenging, but you have proven that with good management and integrity, investors can still earn reliable returns. They communicate with investors regularly and keep us updated about our investments.',
      image: 'https://picsum.photos/seed/abdullahi/400/400',
      rating: 5,
    },
    {
      name: 'Barr. Ifeoma Eze',
      role: 'Investor, Port Harcourt',
      content: 'Nigeria\'s economy has faced many challenges over the years, but SBH has shown resilience and professionalism in managing agricultural investments. Even during difficult periods, you remained committed to paying investors their ROI as promised. That level of responsibility has built strong trust among investors like me.',
      image: 'https://picsum.photos/seed/ifeoma/400/400',
      rating: 5,
    },
    {
      name: 'Mr. Musa Lawal',
      role: 'Customer, Abuja',
      content: 'I have been buying DAD\'S RICE for almost three years now, and the quality has remained consistent. It is clean, tasty, and cooks very well. I recommend it to friends and family because it represents the quality of Nigerian agriculture done right.',
      image: 'https://picsum.photos/seed/musa/400/400',
      rating: 5,
    },
    {
      name: 'Chief Peter Ogunleye',
      role: 'Early Investor, Ogun State',
      content: 'I was among the early supporters of Salvage Business hub agricultural investment program. Watching the company grow over the last six years has been inspiring. They have created opportunities for us investors with my friends while also contributing to Nigeria\'s food security through farming. I am proud to be associated with such a visionary company.',
      image: 'https://picsum.photos/seed/peter/400/400',
      rating: 5,
    },
    {
      name: 'Sarah Collins',
      role: 'UK Investor, Manchester',
      content: 'I initially approached your company as a diversification opportunity within my portfolio, but it has quickly become one of my most reliable investments. The combination of modern farming techniques, disciplined execution, and strong market positioning has translated into steady and predictable returns. Over the past 2 years, my confidence in your model has only grown, and I am now considering increasing my stake.',
      image: 'https://picsum.photos/seed/sarah/400/400',
      rating: 5,
    },
    {
      name: 'Kwame Mensah',
      role: 'Ghana Investor, Accra',
      content: 'Having invested in agriculture within West Africa for years, I understand the risks and realities of the sector. What sets your company apart is its structure and consistency. From land preparation to harvest cycles, everything is handled with professionalism. Since my investment, I’ve received returns as projected, and the updates have always been clear and timely. This is one of the few agribusiness investments I consider both stable and scalable.',
      image: 'https://picsum.photos/seed/kwame/400/400',
      rating: 5,
    },
    {
      name: 'Abena Owusu',
      role: 'Ghana Investor, Kumasi',
      content: 'I chose to invest with your company because it offered more than just financial returns, it presented an opportunity to be part of something meaningful. Over time, I’ve seen both sides deliver. My investment has grown steadily, and I’ve witnessed firsthand the expansion of your farming operations and the positive impact on local communities. It gives me confidence knowing my capital is working efficiently while contributing to food security and economic growth.',
      image: 'https://picsum.photos/seed/abena/400/400',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-brand-dark pt-32">
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
            Testimonials
          </motion.h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Real stories from our partners, investors, and loyal customers of Salvage Biz-Hub Ltd.
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
          <motion.button
            whileHover={{ 
              borderTopLeftRadius: "2rem",
              borderBottomRightRadius: "2rem",
              scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-brand-orange hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl"
          >
            Submit a Testimonial
          </motion.button>
        </div>
      </section>
    </div>
  );
}
