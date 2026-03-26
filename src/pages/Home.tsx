import { motion } from 'motion/react';
import { ArrowRight, Globe, Leaf, Droplets, Zap, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-Width Brand Hero Section */}
      <section className="relative flex items-center min-h-[160vh] overflow-hidden bg-brand-orange">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center pt-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-white"
          >
            <h4 className="text-brand-yellow font-bold uppercase tracking-[0.4em] text-sm mb-8">Premium Quality</h4>
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] mb-10 tracking-tighter">
              BETTER RICE<br />
              <span className="text-brand-dark/20">BETTER LIFE</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-50 mb-14 leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
              Transforming the global rice supply chain through sustainable innovation and community-driven growth. We empower farmers and nourish communities worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/investment" 
                className="bg-brand-dark hover:bg-black text-white px-12 py-6 rounded-full font-bold text-lg transition-all flex items-center group shadow-2xl hover:scale-105"
              >
                Invest Now <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/cooperative" 
                className="bg-transparent border-2 border-white/30 hover:border-white text-white px-12 py-6 rounded-full font-bold text-lg transition-all hover:bg-white/10"
              >
                Join Cooperative
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-Nav / Capabilities Bar */}
      <div className="bg-brand-light border-b border-gray-200 sticky top-16 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-12 py-4">
            <a href="#capabilities" className="text-sm font-semibold text-gray-600 hover:text-brand-green transition-colors">Capabilities</a>
            <a href="#products" className="text-sm font-semibold text-gray-600 hover:text-brand-green transition-colors">Products</a>
            <a href="#sustainability" className="text-sm font-semibold text-gray-600 hover:text-brand-green transition-colors">Sustainability</a>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-24 bg-white" id="capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h4 className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-4">Over Three Decades</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight mb-8">
                We've built one of the largest networks of rice growers.
              </h2>
            </div>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                We've established ourselves as a market-leader trusted by farmers, stakeholders, and customers worldwide. Guided by our purpose to transform food and agriculture for a sustainable future.
              </p>
              <p>
                We collaborate closely with governments and local communities to build resilience and sustainable practices across the supply chain, from farm to plate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Origins / Map Section */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Local Rice Origins with <span className="text-brand-yellow">Global Markets</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're at the heart of global rice trade flows as a trusted partner, unlocking value for our customers and enabling farming communities to prosper worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { country: 'Nigeria', varieties: 'Long Grain, Parboiled', img: 'https://images.unsplash.com/photo-1590732104300-36916892520f?q=80&w=1974&auto=format&fit=crop' },
              { country: 'Thailand', varieties: 'Jasmine, Hom Mali', img: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop' },
              { country: 'India', varieties: 'Basmati, Long Grain', img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop' }
            ].map((origin, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-3xl overflow-hidden group border border-gray-700"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={origin.img} 
                    alt={origin.country} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{origin.country}</h3>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">Varieties</p>
                  <p className="text-gray-300">{origin.varieties}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-24 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h4 className="text-brand-green font-bold uppercase tracking-widest text-sm mb-4">Our Portfolio</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Products by Categories</h2>
            </div>
            <Link to="/buy-rice" className="text-brand-green font-semibold flex items-center hover:underline">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Long Grain', img: 'https://images.unsplash.com/photo-1586201352831-482926d44e4d?q=80&w=200&auto=format&fit=crop' },
              { name: 'Jasmine', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=200&auto=format&fit=crop' },
              { name: 'Basmati', img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=200&auto=format&fit=crop' },
              { name: 'Parboiled', img: 'https://images.unsplash.com/photo-1586201352831-482926d44e4d?q=80&w=200&auto=format&fit=crop' },
              { name: 'Glutinous', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=200&auto=format&fit=crop' },
              { name: 'Short Grain', img: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=200&auto=format&fit=crop' }
            ].map((cat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-brand-light group-hover:border-brand-yellow transition-colors shadow-md">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="font-semibold text-brand-dark">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-brand-light" id="sustainability">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
              <span className="text-brand-orange">Our Vision</span> from Farm to Plate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming rice supply chains for a brighter future for farmers, consumers, and our planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Data-Led', icon: <TrendingUp className="h-8 w-8 text-brand-blue" />, desc: 'We use advanced monitoring to measure our impact across sustainability metrics.' },
              { title: 'Transparency', icon: <Globe className="h-8 w-8 text-brand-yellow" />, desc: 'End-to-end digital traceability ensures quality and accountability.' },
              { title: 'Partnership', icon: <Users className="h-8 w-8 text-brand-green" />, desc: 'Collaborating with global organizations to improve supply chain resilience.' },
              { title: 'Livelihoods', icon: <Zap className="h-8 w-8 text-brand-orange" />, desc: 'Raising farmer incomes and providing vocational training hubs.' },
              { title: 'Water Optimization', icon: <Droplets className="h-8 w-8 text-brand-blue" />, desc: 'Implementing techniques that reduce water usage while increasing yields.' },
              { title: 'Regenerate Nature', icon: <Leaf className="h-8 w-8 text-brand-green" />, desc: 'Focusing on biodiversity, crop rotation, and soil health.' }
            ].map((vision, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6">{vision.icon}</div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{vision.title}</h3>
                <p className="text-gray-600 leading-relaxed">{vision.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Talk to Us</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Whether you’re interested in speaking to our management team, enquiring about one of our products or partnering with us, we want to hear from you.
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-brand-green hover:bg-green-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
