import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Phone, Mail } from 'lucide-react';

interface Director {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  phone?: string;
  email?: string;
}

const directors: Director[] = [
  {
    id: '1',
    name: 'Amb. Dasplang Ayuba Dauda RS-FiGPCM',
    role: 'MD/CEO',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/executive5.jpeg',
    phone: '08057425111',
    bio: 'Amb. Dasplang Ayuba Dauda is the visionary Managing Director and Chief Executive Officer of Salvage Biz-Hub Nig. Ltd. With a strong background in agricultural leadership and business innovation, he has spearheaded the company\'s expansion into large-scale rice cultivation and sustainable agribusiness. His strategic leadership is focused on driving food security and creating high-value investment opportunities in the non-oil sector.'
  },
  {
    id: '2',
    name: 'Pst. Charles Isaac',
    role: 'Chief Financial Officer',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/exe1.jpeg',
    phone: '+234(0)7044093116',
    bio: 'Pst. Charles Isaac serves as the Chief Financial Officer, overseeing the company\'s financial strategy, capital allocation, and fiscal management. With extensive experience in financial planning and audit, he ensures the integrity of our investment models and maintains the highest standards of financial transparency. His expertise is crucial in optimizing returns for our investors and managing the company\'s robust growth.'
  },
  {
    id: '3',
    name: 'Hon. Ayooluwa Adeyemo',
    role: 'Procurement Director',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/exe2.jpeg',
    phone: '07033307384',
    bio: 'Hon. Ayooluwa Adeyemo is the Procurement Director at Salvage Biz-Hub Nig. Ltd. He manages the strategic sourcing of agricultural inputs, equipment, and resources necessary for our large-scale farming operations. His role is vital in maintaining supply chain efficiency, ensuring quality control, and optimizing procurement costs to support our sustainable farming initiatives.'
  },
  {
    id: '4',
    name: 'Hon. Samuel Jackson',
    role: 'Investment/Strategy Director',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/exe6.jpeg',
    email: 'samueljack123@gmail.com',
    bio: 'Hon. Samuel Jackson leads our Investment and Strategy department. He is responsible for identifying new market opportunities, developing strategic partnerships, and designing investment products that deliver consistent value. His deep understanding of market dynamics and strategic planning helps Salvage Biz-Hub navigate the complexities of the agricultural investment landscape.'
  },
  {
    id: '5',
    name: 'Mrs. Progress David',
    role: 'Trading and Export Director',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/lady.jpeg',
    phone: '+234(0)8059749818',
    email: 'progressdavid.sbh@gmail.com',
    bio: 'Mrs. Progress David serves as the Trading and Export Director, managing the company\'s international trade relations and export operations. She oversees the distribution of our premium agricultural products, including \'DAD\'s RICE\', to global markets. Her expertise in international trade compliance and market expansion is key to our mission of contributing to global food security.'
  },
  {
    id: '6',
    name: 'Pst. Mrs. Eno Hodge',
    role: 'Chief Operating Officer',
    image: 'https://raw.githubusercontent.com/ghostshadow526/jtech/main/exe4.jpeg',
    phone: '+2348053130324',
    bio: 'Pst. Mrs. Eno Hodge is the Chief Operating Officer at Salvage Biz-Hub Nig. Ltd. She is responsible for overseeing the day-to-day administrative and operational functions of the company. Her leadership ensures that our farming projects, logistics, and internal processes run smoothly and efficiently, supporting our commitment to excellence in the agricultural sector.'
  }
];

export default function BoardOfDirectors() {
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-brand-orange pt-32">
        {/* Right Side Curved Image */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block"
          style={{
            clipPath: 'ellipse(100% 100% at 100% 50%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
            alt="Agriculture Landscape"
            className="w-full h-full object-cover"
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
            <nav className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest mb-12">
              <span className="opacity-60">About Us</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
              <span>Board of Directors</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 leading-none">
              Our <span className="text-brand-dark">Guiding</span> Experts
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="bg-brand-dark py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="text-brand-orange">Effective governance</span> and informed perspectives
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed"
            >
              <p>
                Our diverse board have been carefully selected to deliver governance and expertise. They oversee and contribute to the development and effectiveness of our strategy, capital allocation and investment decisions. Each member brings with them broad experience and informed perspectives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Directors Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {directors.map((director, idx) => (
              <motion.div
                key={director.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden rounded-tl-[60px] rounded-br-[60px] bg-gray-200">
                  <img
                    src={director.image}
                    alt={director.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{director.name}</h3>
                <p className="text-sm text-gray-600 mb-4 px-4 leading-snug h-12 flex items-center justify-center">
                  {director.role}
                </p>
                <motion.button
                  onClick={() => setSelectedDirector(director)}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-sm font-bold text-brand-orange hover:text-brand-dark transition-colors flex items-center space-x-1"
                >
                  <span>View Biography</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography Modal */}
      <AnimatePresence>
        {selectedDirector && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDirector(null)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedDirector(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-dark hover:text-brand-orange transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-2/5 aspect-[4/5] md:aspect-auto">
                <img
                  src={selectedDirector.image}
                  alt={selectedDirector.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 p-8 md:p-16 overflow-y-auto max-h-[60vh] md:max-h-none">
                <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4 leading-tight">
                  {selectedDirector.name}
                </h2>
                <p className="text-lg font-bold text-brand-orange mb-6 uppercase tracking-wider">
                  {selectedDirector.role}
                </p>
                
                <div className="flex flex-col space-y-3 mb-8">
                  {selectedDirector.phone && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-5 h-5 text-brand-orange" />
                      <span className="font-medium">{selectedDirector.phone}</span>
                    </div>
                  )}
                  {selectedDirector.email && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="w-5 h-5 text-brand-orange" />
                      <span className="font-medium">{selectedDirector.email}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 h-1 bg-brand-orange mb-8" />
                <div className="prose prose-lg text-gray-600 leading-relaxed">
                  <p>{selectedDirector.bio}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
