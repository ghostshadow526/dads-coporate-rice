import { motion } from 'motion/react';
import { Users, CheckCircle, ArrowRight, ShieldCheck, TrendingUp, Info, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReadMore } from '../components/ReadMore';

export default function CooperativeLanding() {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight font-serif italic"
          >
            Salvage Multipurpose Cooperative Society (SMCS)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed"
          >
            The Salvage Multipurpose Cooperative Society (SMCS) is designed to empower women, youths, farmers, traders, and entrepreneurs through structured savings, affordable financing, and mentorship, encouraging the power of small savings to achieve greater things.
          </motion.p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-12 text-center space-y-6">
              <p className="text-2xl font-bold text-gray-800 leading-relaxed font-serif italic max-w-3xl mx-auto">
                "Are you a woman, youth, or entrepreneur looking to thrive in agriculture, business, or finance? Do you desire a support system that empowers, mentors, and finances your dreams without unnecessary obstacles?"
              </p>
              <p className="text-lg text-gray-600">
                Welcome to the Salvage Multipurpose Cooperative Society, a community designed to build wealth, create opportunities, and provide financial security for its members.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-6 font-serif">Membership Benefits:</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      'Structured savings with annual interest',
                      'Business loans with no collateral requirement',
                      'Access to subsidized food supplies',
                      'Business mentorship and financial literacy',
                      'Agricultural empowerment programs',
                    ].map((item) => (
                      <div key={item} className="flex items-center space-x-3 text-gray-700 font-medium">
                        <div className="bg-green-100 p-1 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-700" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-3xl border-2 border-dashed border-green-200">
                  <h4 className="font-black text-green-900 mb-4 uppercase tracking-tighter flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Who Can Join?
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-600 font-medium">
                    <li className="flex items-start space-x-2"><span>🔸</span> <span>Aspiring and existing entrepreneurs</span></li>
                    <li className="flex items-start space-x-2"><span>🔸</span> <span>Farmers looking for financial support and training</span></li>
                    <li className="flex items-start space-x-2"><span>🔸</span> <span>Traders and small-scale business owners</span></li>
                    <li className="flex items-start space-x-2"><span>🔸</span> <span>Individuals seeking financial security and growth opportunities</span></li>
                    <li className="flex items-start space-x-2"><span>🔸</span> <span>Anyone who believes in the power of cooperative success!</span></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-black text-gray-900 font-serif">Why Join SMCS?</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Turn Small Savings into Big Opportunities</span>
                    </h4>
                    <ReadMore maxHeight="60px">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Many people struggle to save because they believe they don’t earn enough. However, we emphasize the power of small, consistent savings, proven to grow into substantial capital over time. With us, your savings are safe, structured, and rewarding, earning interest at the end of each year.
                      </p>
                    </ReadMore>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span>Financial Support Without Collateral</span>
                    </h4>
                    <ReadMore maxHeight="60px">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Unlike traditional banks that demand collateral and have strict lending policies, we offer business loans at just 5% per month with NO collateral! Whether you need capital for farming, expansion, or starting a small business, our loans are designed to support you without stress.
                      </p>
                    </ReadMore>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <span>Affordable Access to Food Supplies</span>
                    </h4>
                    <ReadMore maxHeight="60px">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        We understand that food security is crucial for financial stability. That’s why we provide members with access to essential foodstuffs at subsidized rates, with flexible repayment plans. No more financial strain when it comes to feeding your family or stocking up your store!
                      </p>
                    </ReadMore>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2">
                      <ArrowRight className="w-5 h-5 text-green-600" />
                      <span>Mentorship & Business Growth Opportunities</span>
                    </h4>
                    <ReadMore maxHeight="60px">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Success in business or agriculture requires knowledge, guidance, and mentorship. As a member, you’ll gain access to:
                        <br />✅ Expert coaching on business strategies and financial management.
                        <br />✅ Networking opportunities with like-minded individuals.
                        <br />✅ Mentorship programs that will guide you toward profitability and sustainability.
                      </p>
                    </ReadMore>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                    <h4 className="font-black text-gray-900 mb-2 flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <span>Agricultural & Business Empowerment</span>
                    </h4>
                    <ReadMore maxHeight="60px">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Agriculture is one of the most lucrative industries when managed correctly. Through our cooperative, we bring together women and youths in agriculture, providing financial backing, training, and strategic support to help members flourish in agribusiness and beyond.
                      </p>
                    </ReadMore>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-8 mt-12 pt-12 border-t border-gray-100">
              <div className="inline-block px-6 py-2 bg-green-100 text-green-800 rounded-full font-black uppercase tracking-widest text-xs">
                Your Pathway to Financial Growth and Business Success!
              </div>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-gray-600 italic">
                  Becoming a member of Salvage Multipurpose Cooperative Society means stepping into a community of financial empowerment, growth, and limitless possibilities. Whether you need financial assistance, mentorship, food security, or savings benefits, we have a solution for you.
                </p>
                <p className="text-lg font-bold text-green-800">
                  Join us today and take control of your financial future!
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-3xl border border-green-100 max-w-md mx-auto">
                <h4 className="font-black text-green-900 mb-2 uppercase tracking-wider">Membership Details</h4>
                <p className="text-green-800 mb-4">
                  Registration Fee: <strong className="text-2xl">₦2,500</strong>
                </p>
                <p className="text-sm text-green-700 italic mb-6">
                  Includes: The form, savings passbook and cooperative byelaws.
                </p>
                <Link
                  to="/cooperative"
                  className="inline-flex items-center justify-center w-full bg-green-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-xl hover:shadow-green-200 space-x-3"
                >
                  <span>Join SMCS Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="space-y-2">
                <p className="text-brand-orange font-black text-2xl italic">
                  "The Time to Secure Your Future is NOW!"
                </p>
                <p className="text-gray-500 text-sm">
                  For more information on how to become a member, contact us now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
