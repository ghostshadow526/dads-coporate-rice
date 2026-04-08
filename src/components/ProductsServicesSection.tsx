import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';

import { ReadMore } from './ReadMore';

export default function ProductsServicesSection() {
  const [selectedService, setSelectedService] = React.useState<number | null>(null);

  const handleServiceAction = (idx: number) => {
    const service = services[idx];
    if (service.link) {
      window.location.href = service.link;
    } else {
      setSelectedService(idx);
    }
  };

  const services = [
    {
      title: "Rice",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20icon.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20img.jpeg",
      bio: "Premium quality rice sourced from local Nigerian farmers, processed with the highest standards to ensure nutritional value and great taste. We bridge the gap between farm and table."
    },
    {
      title: "DAD’s Rice!",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/bag.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20img2.jpeg",
      bio: `**DAD’s Rice!, where quality meets pride, from our farm to your pot.**

DAD’s Rice, a proud product of Salvage Biz-Hub Ltd, is our signature parboiled rice crafted for people who value taste, quality, and trust in every meal.

🌾 **What makes DAD’s Rice exceptional?**

* Premium long grains that cook fluffy and non-sticky every time
* Distinct natural aroma that enhances every dish
* Naturally sweet taste, with no artificial additives
* Stone-free, clean, and well processed for your peace of mind
* Freshly produced, not stored for months like imported rice
* Meets international standards, yet proudly Nigerian

From jollof to fried rice to everyday meals, DAD’s Rice delivers perfect results your family will love, every single time.

More than just rice, it’s a bold statement: supporting local farmers, strengthening Nigeria’s economy, and choosing quality made at home.

Because the truth is simple:
**The best rice for Nigerians should be Nigerian.**

🇳🇬 Proudly Nigerian. Globally competitive.

DAD’s Rice!, A proud product of Salvage Biz-Hub Ltd. Taste the pride. Experience excellence.`
    },
    {
      title: "Risk Management Solutions",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/rice%20icon.webp",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/risk%20management.webp",
      bio: `### Risk Management Solutions for Agricultural Investments | Salvage Biz-Hub

**Comprehensive Agricultural Risk Management for Sustainable Investment Growth**

In the fast-evolving global agricultural sector, risk is inevitable, but unmanaged risk can be costly. Salvage Biz-Hub delivers advanced risk management solutions for agricultural investments, helping investors, agribusinesses, and stakeholders protect assets, ensure sustainability, and achieve long-term profitability.

Our solutions combine data-driven risk assessment, strategic planning, and insurance-backed protection, positioning us as a trusted partner in agriculture and agricultural investment security.

#### Our Agricultural Risk Management Services

**1. Agricultural Risk Assessment & Analysis**
We provide comprehensive agricultural risk assessments that identify and evaluate potential threats across the value chain, including:
* Climate and weather variability
* Market price fluctuations
* Supply chain disruptions
* Policy and regulatory risks
Our insights enable informed decision-making and reduce uncertainty in agribusiness and agricultural investments.

**2. Risk Mitigation Strategies for Agribusiness**
Our team develops customized risk mitigation strategies designed to minimize exposure and enhance resilience. These include:
* Diversification models
* Financial risk planning
* Operational contingency frameworks
* Technology-driven monitoring systems
We ensure your investments remain stable even in volatile market conditions.

**3. Sustainable Agriculture & Investment Protection**
We prioritize sustainable agricultural practices that protect both profitability and the environment. Our solutions support:
* Long-term soil and resource management
* Climate-smart agriculture
* ESG-aligned investment strategies
This ensures your agricultural portfolio remains viable and competitive in the global market.

**4. Continuous Risk Monitoring & Advisory**
Risk is dynamic, and so are our solutions. We provide:
* Ongoing risk monitoring
* Real-time advisory support
* Market intelligence updates
This proactive approach allows investors to adapt quickly to emerging threats and opportunities.

#### Why Salvage Biz-Hub is a Leader in Agricultural Risk Management
* Expertise in agricultural investment risk management
* Data-driven and technology-enabled solutions
* Strong focus on sustainability and long-term returns
* Trusted by partners across the agribusiness ecosystem

#### Insurance-Backed agriculture and Agricultural Investment Security
Salvage Biz-Hub is proudly covered by **AIICO Insurance**, one of Nigeria’s leading insurance providers. This partnership adds an extra layer of protection, giving our clients confidence that their investments are safeguarded against unforeseen risks.

**Secure Your Agricultural Investments Today**
With Salvage Biz-Hub’s risk management solutions, you gain more than protection, you gain a competitive advantage. Our goal is to help you reduce risk, increase resilience, and maximize returns in the agricultural sector.

👉 **Partner with us today and build a secure, sustainable, and profitable agricultural future**`
    },
    {
      title: "SMCS Cooperative",
      icon: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/Untitled%20design%20(1).png",
      image: "https://raw.githubusercontent.com/ghostshadow526/jtech/main/ChatGPT%20Image%20Mar%2026%2C%202026%2C%2009_08_34%20AM.png",
      bio: "The Salvage Multipurpose Cooperative Society (SMCS) is designed to empower women, youths, farmers, traders, and entrepreneurs through structured savings, affordable financing, and mentorship, encouraging the power of small savings to achieve greater things.",
      link: "/cooperative-info"
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
              <ReadMore maxHeight="200px">
                <div className="space-y-6">
                  <p>
                    We are redefining agriculture and agribusiness by training and empowering our farmers with the tools, funding, and global market access they need to succeed in the agriculture industry.
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
                </div>
              </ReadMore>
              <div className="pt-4">
                <p className="font-black text-brand-dark uppercase tracking-tighter text-xl">Salvage Biz-Hub</p>
                <p className="text-brand-orange font-bold italic">... Creating wealth through Agriculture ...</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid - Styled like Board of Directors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

              <h3 className="text-xl font-black text-brand-dark mb-4 uppercase tracking-tighter">
                {service.title}
              </h3>
              
              <motion.button
                onClick={() => handleServiceAction(idx)}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="text-sm font-bold text-brand-orange hover:text-brand-dark transition-colors flex items-center space-x-2 bg-brand-orange/10 px-6 py-2 rounded-full"
              >
                <span>{service.link ? 'Learn More' : 'View Details'}</span>
                {service.link ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
              <div className="flex-1 p-8 md:p-16 overflow-y-auto max-h-[80vh] flex flex-col custom-scrollbar">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-xl p-2 flex-shrink-0">
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
                
                <div className="w-12 h-1 bg-brand-orange mb-8 flex-shrink-0" />
                
                <div className="markdown-body prose prose-lg text-gray-600 leading-relaxed max-w-none flex-1">
                  <Markdown>
                    {services[selectedService].bio}
                  </Markdown>
                </div>

                <div className="mt-12 flex-shrink-0">
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
