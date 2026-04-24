import { useState, useEffect } from 'react';
import { FirebaseUser, db, collection, addDoc, Timestamp, query, where, getDocs } from '../firebase';
import { UserProfile, Investment as InvestmentType, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, CheckCircle, ArrowRight, ShieldCheck, DollarSign, Info } from 'lucide-react';
import { simulatePayment } from '../services/paymentService';
import { generateInvestmentPDF } from '../services/pdfService';
import { sendCompanyNotification } from '../services/notificationService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InvestmentProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

export default function Investment({ user, profile }: InvestmentProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [slots, setSlots] = useState(1);
  const [plan, setPlan] = useState('Standard Plan');
  const navigate = useNavigate();

  const REGISTRATION_FEE = 5000;
  const SLOT_PRICE = 10000;

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'payments'),
          where('uid', '==', user.uid),
          where('purpose', '==', 'Investment Access Fee'),
          where('status', '==', 'success')
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setStep(2);
        }
      } catch (error) {
        console.error('Error checking access:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [user]);

  const handlePayRegistration = async () => {
    setProcessing(true);
    try {
      await simulatePayment(REGISTRATION_FEE, 'Investment Access Fee', user.uid, {
        email: user.email || profile?.email || '',
        displayName: profile?.displayName || user.displayName || 'Customer',
      });
      // User is redirected to Korapay.
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: profile?.displayName || '',
    address: '',
    phone: profile?.phoneNumber || '',
    nextOfKin: '',
    nextOfKinPhone: '',
    relationship: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleInvest = async () => {
    setProcessing(true);
    const totalAmount = slots * SLOT_PRICE;
    try {
      await simulatePayment(totalAmount, `Investment: ${plan}`, user.uid, {
        plan,
        slots,
        formData,
        email: user.email || profile?.email || '',
        displayName: profile?.displayName || user.displayName || formData.fullName || 'Customer',
      });
      // User is redirected to Korapay. Webhook handles investment creation.
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('Investment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900 mb-0.5 tracking-tight uppercase">Invest in salvagebizhub Rice</h1>
        <p className="text-gray-500 text-[11px]">Secure your future by investing in sustainable agriculture.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= i ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i ? <CheckCircle className="w-4 h-4" /> : i}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step >= i ? 'text-green-700' : 'text-gray-400'
              }`}>
                {i === 1 ? 'Access' : i === 2 ? 'Invest' : 'Complete'}
              </span>
              {i < 3 && <div className="w-10 h-px bg-gray-200 hidden sm:block"></div>}
            </div>
          ))}
        </div>

        <div className="p-5 md:p-6">
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
                    <h3 className="font-bold text-blue-900 mb-1 uppercase">Investment Access Fee</h3>
                    <p className="text-blue-800 text-sm">
                      To access our investment opportunities, a one-time registration fee of <strong>NGN 5,000</strong> is required. This fee unlocks the investment form and all future investment plans.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 uppercase">Why invest with us?</h3>
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
                  disabled={processing}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Pay NGN ${REGISTRATION_FEE.toLocaleString()} to Unlock`}
                  {!processing && <ArrowRight className="w-5 h-5" />}
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
                    <h3 className="text-xl font-bold text-gray-900 uppercase">Personal Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Residential Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="123 Main St, Abuja"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Relationship</label>
                          <input
                            type="text"
                            value={formData.relationship}
                            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Spouse, Child, etc."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Next of Kin</label>
                          <input
                            type="text"
                            value={formData.nextOfKin}
                            onChange={(e) => setFormData({ ...formData, nextOfKin: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Next of Kin Phone</label>
                          <input
                            type="text"
                            value={formData.nextOfKinPhone}
                            onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 pt-4 uppercase">Bank Details (For Returns)</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
                          <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Name</label>
                          <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 uppercase">Investment Plan</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Plan</label>
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
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Number of Slots</label>
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

                    <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                      <h3 className="text-lg font-bold text-green-900 mb-4 uppercase">Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-green-800">
                          <span>Plan:</span>
                          <span className="font-bold">{plan}</span>
                        </div>
                        <div className="flex justify-between text-green-800">
                          <span>Slots:</span>
                          <span className="font-bold">{slots}</span>
                        </div>
                        <div className="flex justify-between text-green-800 border-t border-green-200 pt-3 mt-3">
                          <span className="font-bold">Total:</span>
                          <span className="text-2xl font-bold text-green-700">NGN {(slots * SLOT_PRICE).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleInvest}
                      disabled={processing || !formData.fullName || !formData.address || !formData.phone}
                      whileHover={{ 
                        borderTopLeftRadius: "2rem",
                        borderBottomRightRadius: "2rem",
                        scale: 1.02
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {processing ? 'Processing Payment...' : 'Confirm & Pay Now'}
                      {!processing && <DollarSign className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
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
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">Investment Successful!</h2>
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
