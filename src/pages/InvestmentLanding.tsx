import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, MapPin, Eye, ArrowRight, CheckCircle2, HelpCircle, DollarSign, PieChart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReadMore } from '../components/ReadMore';

export default function InvestmentLanding() {
  const stats = [
    { label: "ROI Every 6 Months", value: "38%", icon: TrendingUp },
    { label: "Insurance Coverage", value: "100%", icon: ShieldCheck },
    { label: "Investment Risk", value: "0%", icon: PieChart },
    { label: "Refund Policy", value: "100%", icon: DollarSign },
  ];

  const highlights = [
    "Professionally managed farm projects",
    "Defined investment cycles",
    "Transparent operations with farm visitation options",
    "Capital protection structures",
    "Local and diaspora participation",
  ];

  const faqs = [
    {
      q: "Is my investment secure?",
      a: "All investments are professionally managed with structured processes, defined timelines, and capital protection mechanisms. Proudly covered by American International Insurance Company (AIICO), 100% Refund policy."
    },
    {
      q: "Do I need farming experience to invest?",
      a: "No. Our team manages all farming operations on behalf of the investors."
    },
    {
      q: "Can I visit the farm?",
      a: "Yes. Investors are welcome to visit project sites to see how their money is working for them, subject to prior arrangement."
    },
    {
      q: "How are returns paid?",
      a: "Returns are paid through official company channels at the end of each investment cycle."
    },
    {
      q: "Can I reinvest my returns?",
      a: "Yes. Investors may roll over capital and returns into new investment cycles."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80" 
            alt="Rice Farm" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              Become a Farmer <br />
              <span className="text-brand-orange">Without Necessarily Going to Farm</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
              Our structured agricultural investment program allows individuals and organizations to participate in profitable farming ventures without hands-on involvement.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Link 
                to="/investment"
                className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-tighter hover:bg-white hover:text-brand-orange transition-all shadow-2xl flex items-center group"
              >
                Start Investing Now
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 text-center group hover:border-brand-orange transition-colors"
              >
                <stat.icon className="w-8 h-8 text-brand-orange mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-brand-dark mb-1 tracking-tighter">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-black text-brand-dark uppercase tracking-tighter mb-6 leading-none">
                  Turn Your Money Into <br />
                  <span className="text-brand-orange">Wealth Through Agriculture</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p className="font-bold text-brand-dark text-xl">
                    Agriculture is the backbone of every economy and one of the most sustainable and recession-proof industries.
                  </p>
                  <p>
                    With the rising demand for food globally, investing in agriculture is one of the smartest financial decisions you can make today! At Salvage Biz-Hub Nig Ltd, we are giving you a golden opportunity to become a stakeholder in the booming agribusiness sector through our empowerment program.
                  </p>
                  
                  <ReadMore maxHeight="150px" className="mt-8">
                    <div className="space-y-8">
                      <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-4">Rice Supply-Demand Gap in Nigeria</h3>
                        <ul className="space-y-4">
                          <li className="flex items-start space-x-3">
                            <CheckCircle2 className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <span><strong>Production vs. Demand:</strong> In 2023, Nigeria produced approximately 5.2 million metric tons of milled rice. However, the national demand was around 7.83 million metric tons, leaving a deficit of about 2.63 million metric tons.</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <CheckCircle2 className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <span><strong>Import Dependency:</strong> To bridge this gap, Nigeria has historically relied on rice imports, which constituted up to 50% of local consumption in past years.</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <CheckCircle2 className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <span><strong>Consumption Growth:</strong> Rice consumption in Nigeria has been increasing at a rate of approximately 10% per annum, driven by changing consumer preferences and population growth.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-brand-orange/5 p-8 rounded-3xl border border-brand-orange/10">
                        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-4">Global Rice Consumption Trends</h3>
                        <ul className="space-y-4">
                          <li className="flex items-start space-x-3">
                            <Globe className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <span><strong>Rising Consumption:</strong> Global rice consumption has been on an upward trajectory, reaching about 523.8 million metric tons in the 2023/24 crop year.</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <Globe className="w-6 h-6 text-brand-orange mt-1 flex-shrink-0" />
                            <span><strong>Production Challenges:</strong> Despite being a staple for over half of the world's population, rice production faces challenges such as limited arable land, water scarcity, and climate change impacts.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Reasons to Invest in Agribusiness</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            { title: "Growing Demand", desc: "Addressing critical food security needs globally." },
                            { title: "Market Opportunities", desc: "Existing supply deficits present lucrative opportunities." },
                            { title: "Economic Diversification", desc: "Reducing reliance on non-renewable sectors." },
                            { title: "Government Support", desc: "Policies and incentives to boost local production." },
                            { title: "Social Impact", desc: "Creating employment and enhancing rural development." }
                          ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                              <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-brand-orange">
                                {i + 1}
                              </div>
                              <div>
                                <h4 className="font-bold text-brand-dark">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ReadMore>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-brand-dark p-10 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-3xl rounded-full -mr-16 -mt-16" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-8">Investment Highlights</h3>
                <ul className="space-y-6">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-4">
                      <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-12 grid grid-cols-1 gap-4">
                  {[
                    "✅ 38% ROI in every 6 months!",
                    "✅ 100% Insurance Coverage",
                    "✅ 0% Loss Risk",
                    "✅ 100% Refund Policy",
                    "✅ No Location Barrier",
                    "✅ Full Transparency"
                  ].map((benefit, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 font-bold">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-8 flex items-center">
                  <HelpCircle className="w-8 h-8 text-brand-orange mr-3" />
                  Investment FAQs
                </h3>
                <div className="space-y-6">
                  {faqs.map((faq, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="font-bold text-brand-dark flex items-center">
                        <span className="w-2 h-2 bg-brand-orange rounded-full mr-2" />
                        {faq.q}
                      </h4>
                      <p className="text-sm text-gray-600 pl-4">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-orange">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Ready to Build Your Wealth?
          </h2>
          <p className="text-xl mb-12 font-medium opacity-90">
            Join our structured agricultural investment program today and earn substantial returns while contributing to food security.
          </p>
          <Link 
            to="/investment"
            className="inline-flex items-center bg-white text-brand-orange px-12 py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter hover:bg-brand-dark hover:text-white transition-all shadow-2xl group"
          >
            Get Started Now
            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
