import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Eye, Users, Mail, Phone, MapPin, Globe, ShieldCheck, Briefcase, Award, TrendingUp, Building2, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 'experience',
    title: 'Our Experience',
    image: 'https://ik.imagekit.io/qrfqn43oq/card2.webp',
    content: 'At Salvage Biz-Hub Nig. Ltd, we have years of collective experience in this industry and we have trained over thirty five thousand (35,000) people in Nigeria who most of them are financially independent now.',
    isAchievement: false
  },
  {
    id: 'impact',
    title: 'Years Impact',
    value: '8',
    image: 'https://ik.imagekit.io/qrfqn43oq/card3.webp',
    content: 'We have helped good number of people/investors across the world to gain high value for their money using the return on their investment, using our technical and domain knowledge on our farming investment as a business and as a profession, thus making them financially independent.',
    isAchievement: true
  },
  {
    id: 'hectares',
    title: 'Hectares (2024)',
    value: '537',
    image: 'https://ik.imagekit.io/qrfqn43oq/card.webp',
    content: 'Within 8 years of establishment, we have expanded our production capacity to 537 hectares of rice farm in 2024. We are pushing towards cultivation 5,000 hectares in the Five years. More so, we are glad to have a special rice brand for the company as "DAD\'s RICE"',
    isAchievement: true
  }
];

export default function AboutUs() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-brand-orange pt-32">
        {/* Right Side Curved Image */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block"
          style={{
            clipPath: 'ellipse(100% 100% at 100% 50%)',
          }}
        >
          <img
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/Salvage%20rice%20farm%20harvest.jpg.jpeg"
            alt="Salvage Rice Farm Harvest"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Mobile Background Image */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <img
            src="https://raw.githubusercontent.com/ghostshadow526/jtech/main/Salvage%20rice%20farm%20harvest.jpg.jpeg"
            alt="Salvage Rice Farm Harvest"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-sm font-bold uppercase tracking-widest mb-8 block">About Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
              Cultivating a <br />
              <span className="text-brand-dark">Sustainable</span> <br />
              Future
            </h1>
            <p className="text-lg text-white/90 leading-relaxed font-medium mb-8 max-w-md">
              Salvage Biz-Hub Nig. Ltd is dedicated to exploring the non-oil sector and driving innovation in global agriculture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Who We Are</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Salvage Biz-Hub Nig. Ltd, we are a dynamic business consulting and agriculture Business (Investment) company, dedicated to exploring the non-oil sector, driving innovation and sustainability in the agricultural business sector, dedicated to fostering growth and sustainability within the Agricultural industry.
                </p>
                <p>
                  We are dedicated to offering varying solutions to improve and facilitate client’s efficiency and productivity in partnership with United State Department of Agriculture (USDA), Federal Ministry of Health department of hospital services, American University of Nigeria (AUN), Industrial Training Fund (ITF), Special Control Unit Against Money Laundering (SCUML) among others, and membership with Plateau State Chamber of Commerce, Mines and Agriculture (PLACCIMA).
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-12 rounded-[40px] border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Specialization</h3>
              <ul className="space-y-4">
                {[
                  'Capacity building trainings',
                  'Business development and management services',
                  'Lifestyle management',
                  'Agriculture (Contract Farming)',
                  'Import and Export'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 p-12 rounded-[40px] backdrop-blur-sm border border-white/10"
            >
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 uppercase tracking-wider">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To be the leading Agriculture and investment company that bridges the gap between individuals and agricultural opportunities by connecting investors with farm projects and provide farm equipment and business management consulting services, aiming to contribute positively to global food security.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 p-12 rounded-[40px] backdrop-blur-sm border border-white/10"
            >
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 uppercase tracking-wider">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To invest, develop and partner with business sectors that demonstrate potential for long-term success and positive impact, cultivating high-quality products using healthy/friendly sustainable methods, through expert consulting services, strategic businesses that foster growth and financial freedom.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 uppercase tracking-widest">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { title: 'Positive mental attitude', icon: <TrendingUp className="w-6 h-6" /> },
              { title: 'Focus', icon: <Target className="w-6 h-6" /> },
              { title: 'Discipline', icon: <ShieldCheck className="w-6 h-6" /> },
              { title: 'Integrity', icon: <Briefcase className="w-6 h-6" /> },
              { title: 'Quality', icon: <Award className="w-6 h-6" /> }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-brand-orange">
                  {value.icon}
                </div>
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{value.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Achievements Slider */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col lg:flex-row overflow-hidden rounded-tl-[60px] rounded-br-[60px] bg-brand-green shadow-2xl min-h-[500px]"
              >
                <div className={`w-full lg:w-1/2 h-64 lg:h-auto ${slides[currentSlide].id === 'impact' ? 'lg:order-2' : ''}`}>
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className={`w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center text-white ${slides[currentSlide].id === 'impact' ? 'lg:order-1' : ''}`}>
                  {slides[currentSlide].isAchievement ? (
                    <div className="flex items-baseline space-x-4 mb-6">
                      <span className="text-6xl font-black leading-none">{slides[currentSlide].value}</span>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter">{slides[currentSlide].title}</h3>
                    </div>
                  ) : (
                    <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">{slides[currentSlide].title}</h2>
                  )}
                  <p className="text-base leading-relaxed opacity-90">
                    {slides[currentSlide].content}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform md:-left-6"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform md:-right-6"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-3 mt-12">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'bg-brand-orange w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Clients & Partners */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-widest">Clients & Partners We Served</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We take pride in our extensive network of government bodies, private farms, and international partners.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "Government & Ministries",
                items: [
                  "Kastina State Government",
                  "Gombe State Government (Ministry of Agriculture)",
                  "Borno State Government (Ministry of Agriculture)",
                  "Adamawa State Government (Ministry of Agriculture)",
                  "Yobe State Government (Ministry of Agriculture)"
                ],
                icon: <Building2 className="w-6 h-6" />
              },
              {
                category: "Private Farms & Organizations",
                items: [
                  "Ajayi Farms, Ikeja Lagos",
                  "Obasanjo Farms, Abeokuta Ogun State",
                  "Apode Farms, Kuje, Abuja",
                  "Factotum Farmers Limited, FCT Abuja",
                  "Earth Organic Limited, UK (London)"
                ],
                icon: <Leaf className="w-6 h-6" />
              },
              {
                category: "Industrial & Regional",
                items: [
                  "Kaduna State (Refining and Petrochemical co. ltd)",
                  "Plateau State: Barkin Ladi, Mangu, Shandam, Langtang, Quanpan",
                  "Etc."
                ],
                icon: <Globe className="w-6 h-6" />
              }
            ].map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-brand-orange">
                  {group.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">{group.category}</h3>
                <ul className="space-y-4">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                      <span className="text-gray-600 text-sm font-medium leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Addresses */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 uppercase tracking-widest text-center">Office Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Company Head Office',
                address: 'BLOCK A, JOSFOOD COMPLEX, ADJACENT CIVIL DEFENSE HQTRS JOS, PLATEAU STATE',
                icon: <Building2 className="w-6 h-6" />
              },
              {
                title: 'Adamawa State Contact Office',
                address: 'OPP. SHAMAT MILL, YOLA',
                phone: '+2348069297237',
                icon: <MapPin className="w-6 h-6" />
              },
              {
                title: 'Taraba State Contact Office',
                address: 'BEHIND YAM MARKET WUKARI',
                phone: '+2347064547143',
                icon: <MapPin className="w-6 h-6" />
              },
              {
                title: 'Gombe State Contact Office',
                address: 'OPP. RICE MARKET ROAD',
                phone: '+2347032554599',
                icon: <MapPin className="w-6 h-6" />
              },
              {
                title: 'Edo State Contact Office',
                address: 'BESIDE YOUTH CENTER IRRUA.',
                phone: '+2348136963647',
                icon: <MapPin className="w-6 h-6" />
              }
            ].map((office, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-brand-orange">
                  {office.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">{office.title}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{office.address}</p>
                {office.phone && (
                  <div className="flex items-center space-x-2 text-brand-green font-bold">
                    <Phone className="w-4 h-4" />
                    <span>{office.phone}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-brand-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">Ready to grow with us?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/login" className="bg-white text-brand-orange px-12 py-6 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
              Get Started
            </a>
            <a href="mailto:info@salvagebizhub.com" className="bg-brand-dark text-white px-12 py-6 rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
