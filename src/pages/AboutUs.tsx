import { motion } from 'motion/react';
import { Target, Eye, Users, Mail, Phone, MapPin, Globe, ShieldCheck, Leaf } from 'lucide-react';

export default function AboutUs() {
  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      email: 'john.doe@dadsrice.com',
      phone: '+234 800 111 2222',
      image: 'https://picsum.photos/seed/john/400/400',
    },
    {
      name: 'Jane Smith',
      role: 'Operations Director',
      email: 'jane.smith@dadsrice.com',
      phone: '+234 800 333 4444',
      image: 'https://picsum.photos/seed/jane/400/400',
    },
    {
      name: 'David Okafor',
      role: 'Agricultural Lead',
      email: 'david.okafor@dadsrice.com',
      phone: '+234 800 555 6666',
      image: 'https://picsum.photos/seed/david/400/400',
    },
    {
      name: 'Sarah Bello',
      role: 'Cooperative Manager',
      email: 'sarah.bello@dadsrice.com',
      phone: '+234 800 777 8888',
      image: 'https://picsum.photos/seed/sarah/400/400',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590732104300-36916892520f?q=80&w=1974&auto=format&fit=crop"
            alt="About Us"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 to-brand-dark"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Our Story
          </motion.h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Building a sustainable future for agriculture through innovation, community, and excellence.
          </p>
        </div>
      </section>

      {/* Vision & Mission - Olam Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-2xl mb-4">
                <Eye className="w-8 h-8 text-brand-green" />
              </div>
              <h2 className="text-4xl font-bold text-brand-dark">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be the leading agricultural platform in Nigeria, empowering farmers and investors through sustainable practices and innovative cooperative models, ensuring food security for all.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-2xl mb-4">
                <Target className="w-8 h-8 text-brand-orange" />
              </div>
              <h2 className="text-4xl font-bold text-brand-dark">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to provide high-quality agricultural products, create profitable investment opportunities, and foster a supportive cooperative community that drives agricultural excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-brand-green mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Sustainability', icon: <Leaf className="h-6 w-6" />, color: 'text-brand-green' },
              { title: 'Transparency', icon: <Globe className="h-6 w-6" />, color: 'text-brand-blue' },
              { title: 'Community', icon: <Users className="h-6 w-6" />, color: 'text-brand-yellow' },
              { title: 'Quality', icon: <ShieldCheck className="h-6 w-6" />, color: 'text-brand-orange' }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl bg-brand-light ${value.color} mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Leadership Team</h2>
            <p className="text-gray-600">The experts driving our agricultural revolution.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-1">{member.name}</h3>
                <p className="text-brand-green font-medium text-sm uppercase tracking-wider">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="inline-flex p-4 rounded-full bg-white/10 text-brand-green">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Visit Us</h4>
              <p className="text-gray-400">123 Rice Farm Road, Nasarawa State, Nigeria</p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex p-4 rounded-full bg-white/10 text-brand-yellow">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Call Us</h4>
              <p className="text-gray-400">+234 800 123 4567</p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex p-4 rounded-full bg-white/10 text-brand-orange">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold">Email Us</h4>
              <p className="text-gray-400">info@dadsrice.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
