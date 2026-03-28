import { useState } from 'react';
import { FirebaseUser, db, collection, addDoc, Timestamp } from '../firebase';
import { UserProfile, Investment as InvestmentType, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle, ArrowRight, ShieldCheck, DollarSign, Info } from 'lucide-react';
import { simulatePayment } from '../services/paymentService';
import { generateInvestmentPDF } from '../services/pdfService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InvestmentProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

export default function Investment({ user, profile }: InvestmentProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState(1);
  const [plan, setPlan] = useState('Standard Plan');
  const navigate = useNavigate();

  const REGISTRATION_FEE = 5000;
  const SLOT_PRICE = 50000;

  const handlePayRegistration = async () => {
    setLoading(true);
    try {
      const payment = await simulatePayment(REGISTRATION_FEE, 'Investment Access Fee', user.uid);
      
      // Save payment record
      const paymentRecord: PaymentRecord = {
        id: payment.transactionId,
        uid: user.uid,
        amount: REGISTRATION_FEE,
        purpose: 'Investment Access Fee',
        status: 'success',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'payments'), paymentRecord);
      
      toast.success('Access fee paid successfully!');
      setStep(2);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    setLoading(true);
    const totalAmount = slots * SLOT_PRICE;
    try {
      const payment = await simulatePayment(totalAmount, `Investment: ${plan}`, user.uid);
      
      // Save payment record
      const paymentRecord: PaymentRecord = {
        id: payment.transactionId,
        uid: user.uid,
        amount: totalAmount,
        purpose: `Investment: ${plan}`,
        status: 'success',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'payments'), paymentRecord);
      
      // Save investment record
      const newInvestment: InvestmentType = {
        uid: user.uid,
        plan,
        slots,
        amount: totalAmount,
        status: 'active',
        paymentId: payment.transactionId,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'investments'), newInvestment);
      
      toast.success('Investment successful!');
      generateInvestmentPDF(newInvestment, profile);
      setStep(3);
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('Investment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Invest in salvagebizhub Rice</h1>
        <p className="text-gray-600 text-lg">Secure your future by investing in sustainable agriculture.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= i ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                step >= i ? 'text-green-700' : 'text-gray-400'
              }`}>
                {i === 1 ? 'Access' : i === 2 ? 'Invest' : 'Complete'}
              </span>
              {i < 3 && <div className="w-12 h-px bg-gray-200 hidden sm:block"></div>}
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-blue-50 p-6 rounded-2xl flex items-start space-x-4 border border-blue-100">
                  <Info className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">Investment Access Fee</h3>
                    <p className="text-blue-800 text-sm">
                      To access our investment opportunities, a one-time registration fee of <strong>NGN 5,000</strong> is required. This fee unlocks the investment form and all future investment plans.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Why invest with us?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Guaranteed returns on investment.',
                      'Transparent management of funds.',
                      'Support local farmers and communities.',
                      'Secure digital tracking of your assets.',
                    ].map((item) => (
                      <div key={item} className="flex items-center space-x-3 text-gray-600 text-sm">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handlePayRegistration}
                  disabled={loading}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay NGN ${REGISTRATION_FEE.toLocaleString()} to Unlock`}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Select Investment Plan</label>
                      <select
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      >
                        <option>Standard Plan (12 Months)</option>
                        <option>Premium Plan (18 Months)</option>
                        <option>Elite Plan (24 Months)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Number of Slots</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSlots(Math.max(1, slots - 1))}
                          className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={slots}
                          onChange={(e) => setSlots(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xl"
                        />
                        <button
                          onClick={() => setSlots(slots + 1)}
                          className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Each slot is NGN {SLOT_PRICE.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-8 rounded-3xl border border-green-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-green-900 mb-4">Investment Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-green-800">
                          <span>Plan:</span>
                          <span className="font-bold">{plan}</span>
                        </div>
                        <div className="flex justify-between text-green-800">
                          <span>Slots:</span>
                          <span className="font-bold">{slots}</span>
                        </div>
                        <div className="flex justify-between text-green-800">
                          <span>Price per slot:</span>
                          <span className="font-bold">NGN {SLOT_PRICE.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-green-200 mt-6">
                      <div className="flex justify-between items-end">
                        <span className="text-green-900 font-bold">Total Amount:</span>
                        <span className="text-3xl font-bold text-green-700 tracking-tight">
                          NGN {(slots * SLOT_PRICE).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleInvest}
                  disabled={loading}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? 'Processing Payment...' : 'Confirm & Pay Now'}
                  {!loading && <DollarSign className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Investment Successful!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your investment has been processed successfully. You can now download your investment document and track your progress in the dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Invest More
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
