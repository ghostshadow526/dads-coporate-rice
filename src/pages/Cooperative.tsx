import { useState, useEffect } from 'react';
import { FirebaseUser, db, collection, addDoc, query, where, onSnapshot, orderBy, Timestamp } from '../firebase';
import { UserProfile, CooperativeMember, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, CheckCircle, ArrowRight, ShieldCheck, Download, CreditCard, Info, History, TrendingUp, Leaf } from 'lucide-react';
import { simulatePayment } from '../services/paymentService';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

interface CooperativeProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

import { handleFirestoreError, OperationType } from '../services/errorService';

import { generateConstitutionPDF, generateByeLawsPDF } from '../services/pdfService';

import { ReadMore } from '../components/ReadMore';

export default function Cooperative({ user, profile }: CooperativeProps) {
  const [member, setMember] = useState<CooperativeMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const navigate = useNavigate();

  const REGISTRATION_FEE = 2500;
  const MONTHLY_DUE = 2000;

  useEffect(() => {
    if (!user) return;

    const qMember = query(collection(db, 'cooperativeMembers'), where('uid', '==', user.uid));
    const qPayments = query(collection(db, 'payments'), where('uid', '==', user.uid), where('purpose', '==', 'Cooperative Monthly Due'), orderBy('createdAt', 'desc'));

    const unsubMember = onSnapshot(qMember, (snapshot) => {
      if (!snapshot.empty) {
        setMember({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CooperativeMember);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'cooperativeMembers'));

    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'payments'));

    return () => {
      unsubMember();
      unsubPayments();
    };
  }, [user]);

  const handleJoin = async () => {
    setProcessing(true);
    try {
      const payment = await simulatePayment(REGISTRATION_FEE, 'Cooperative Registration Fee', user.uid);
      
      // Save payment record
      const paymentRecord: PaymentRecord = {
        id: payment.transactionId,
        uid: user.uid,
        amount: REGISTRATION_FEE,
        purpose: 'Cooperative Registration Fee',
        status: 'success',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'payments'), paymentRecord);
      
      // Save member record
      const newMember: CooperativeMember = {
        uid: user.uid,
        status: 'active',
        registrationFeePaid: true,
        paymentId: payment.transactionId,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'cooperativeMembers'), newMember);
      
      toast.success('Successfully joined the cooperative!');
    } catch (error) {
      console.error('Join error:', error);
      toast.error('Failed to join. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayMonthlyDue = async () => {
    setProcessing(true);
    try {
      const payment = await simulatePayment(MONTHLY_DUE, 'Cooperative Monthly Due', user.uid);
      
      // Save payment record
      const paymentRecord: PaymentRecord = {
        id: payment.transactionId,
        uid: user.uid,
        amount: MONTHLY_DUE,
        purpose: 'Cooperative Monthly Due',
        status: 'success',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'payments'), paymentRecord);
      
      toast.success('Monthly due paid successfully!');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight font-serif italic">Salvage Multipurpose Cooperative Society (SMCS)</h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          The Salvage Multipurpose Cooperative Society (SMCS) is designed to empower women, youths, farmers, traders, and entrepreneurs through structured savings, affordable financing, and mentorship, encouraging the power of small savings to achieve greater things.
        </p>
      </div>

      {!member ? (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
          <div className="p-8 md:p-12">
            <div className="bg-green-50 p-6 rounded-3xl flex items-start space-x-4 border border-green-100 mb-10">
              <Info className="w-6 h-6 text-green-700 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-black text-green-900 mb-1 text-lg uppercase tracking-wider">Membership Registration</h3>
                <p className="text-green-800 leading-relaxed">
                  To join the Salvage Multipurpose Cooperative Society (SMCS), a one-time registration fee of <strong className="text-xl">₦2,500</strong> is required. 
                  <br />
                  <span className="text-sm font-medium opacity-80 italic">Includes: The form, savings passbook and cooperative byelaws.</span>
                </p>
              </div>
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

                <div className="bg-brand-light p-6 rounded-3xl border-2 border-dashed border-green-200">
                  <h4 className="font-black text-green-900 mb-2 uppercase tracking-tighter">Who Can Join?</h4>
                  <ul className="space-y-2 text-sm text-gray-600 font-medium">
                    <li className="flex items-center space-x-2"><span>🔸</span> <span>Aspiring and existing entrepreneurs</span></li>
                    <li className="flex items-center space-x-2"><span>🔸</span> <span>Farmers looking for financial support and training</span></li>
                    <li className="flex items-center space-x-2"><span>🔸</span> <span>Traders and small-scale business owners</span></li>
                    <li className="flex items-center space-x-2"><span>🔸</span> <span>Individuals seeking financial security and growth opportunities</span></li>
                    <li className="flex items-center space-x-2"><span>🔸</span> <span>Anyone who believes in the power of cooperative success!</span></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8 flex flex-col justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Join?</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    By joining SMCS, you gain access to a community dedicated to your financial growth and business success.
                  </p>
                  <Link 
                    to="/cooperative-info"
                    className="text-green-700 font-bold flex items-center hover:underline"
                  >
                    Learn more about SMCS benefits
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <motion.button
                onClick={handleJoin}
                disabled={processing}
                whileHover={{ 
                  borderTopLeftRadius: "3rem",
                  borderBottomRightRadius: "3rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full bg-green-700 text-white py-6 rounded-2xl font-black text-xl hover:bg-green-800 transition-all shadow-2xl hover:shadow-green-200 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Pay ₦${REGISTRATION_FEE.toLocaleString()} to Join SMCS Now`}
                {!processing && <ArrowRight className="w-6 h-6" />}
              </motion.button>
              
              <p className="text-gray-500 font-bold italic">
                "The Time to Secure Your Future is NOW!"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Membership Status */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Dashboard</h2>
                  <p className="text-gray-500 text-sm">Member since {format(member.createdAt.toDate(), 'PPP')}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {member.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Monthly Dues</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">NGN {MONTHLY_DUE.toLocaleString()}</p>
                  <button
                    onClick={handlePayMonthlyDue}
                    disabled={processing}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{processing ? 'Processing...' : 'Pay Monthly Due'}</span>
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Savings</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-4">NGN {(payments.length * MONTHLY_DUE).toLocaleString()}</p>
                  <button className="w-full bg-white text-green-700 border border-green-700 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-all flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>View Dividends</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <History className="w-6 h-6 text-green-700" />
                <span>Monthly Payment History</span>
              </h3>
              <div className="space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-bold text-gray-900">Monthly Due</p>
                      <p className="text-xs text-gray-500">{format(p.createdAt.toDate(), 'PPP')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">NGN {p.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{p.status}</p>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p className="text-center py-10 text-gray-500">No monthly payments recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Documents */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resources</h3>
              <div className="space-y-4">
                <motion.button
                  onClick={() => generateConstitutionPDF(profile)}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-green-700" />
                    <span className="font-bold text-gray-700">Constitution</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => generateByeLawsPDF(profile)}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-green-700" />
                    <span className="font-bold text-gray-700">Bye-laws</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>

            <div className="bg-green-900 text-white p-8 rounded-3xl shadow-xl">
              <ShieldCheck className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Member Support</h3>
              <p className="text-green-100 text-sm leading-relaxed mb-6">
                Need help with your membership or payments? Our cooperative support team is here for you.
              </p>
              <motion.button
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                Contact Support
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
