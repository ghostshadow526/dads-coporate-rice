import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FirebaseUser, db, collection, query, where, onSnapshot, orderBy, Timestamp, addDoc, doc } from '../firebase';
import { UserProfile, Investment, CooperativeMember, RiceOrder, TrainingRegistration, PaymentRecord, Training } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  User, 
  Download, 
  TrendingUp, 
  ShoppingBag, 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Plus,
  DollarSign,
  Wallet
} from 'lucide-react';
import { generateInvestmentPDF, generateReceiptPDF, generateTrainingPassPDF, generateConstitutionPDF, generateByeLawsPDF } from '../services/pdfService';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../services/errorService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { simulatePayment } from '../services/paymentService';
import { toast } from 'sonner';
import FundWallet from '../components/FundWallet';

interface DashboardProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

const MONTHLY_DUE = 5000;

export default function Dashboard({ user, profile }: DashboardProps) {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as any;
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'payments' | 'profile' | 'wallet'>(tabParam || 'overview');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [cooperative, setCooperative] = useState<CooperativeMember | null>(null);
  const [orders, setOrders] = useState<RiceOrder[]>([]);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDue, setProcessingDue] = useState(false);

  useEffect(() => {
    if (tabParam && ['overview', 'documents', 'payments', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      // Profile is handled via props, but we keep this for real-time updates if needed
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}`));

    const unsubInvestments = onSnapshot(
      query(collection(db, 'investments'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')),
      (snapshot) => setInvestments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment))),
      (error) => handleFirestoreError(error, OperationType.LIST, 'investments')
    );

    const unsubCooperative = onSnapshot(
      query(collection(db, 'cooperativeMembers'), where('uid', '==', user.uid)),
      (snapshot) => {
        if (!snapshot.empty) {
          setCooperative({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CooperativeMember);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'cooperativeMembers')
    );

    const unsubOrders = onSnapshot(
      query(collection(db, 'riceOrders'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')),
      (snapshot) => setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RiceOrder))),
      (error) => handleFirestoreError(error, OperationType.LIST, 'riceOrders')
    );

    const unsubRegistrations = onSnapshot(
      query(collection(db, 'trainingRegistrations'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')),
      (snapshot) => setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingRegistration))),
      (error) => handleFirestoreError(error, OperationType.LIST, 'trainingRegistrations')
    );

    const unsubPayments = onSnapshot(
      query(collection(db, 'payments'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')),
      (snapshot) => setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord))),
      (error) => handleFirestoreError(error, OperationType.LIST, 'payments')
    );

    const unsubTrainings = onSnapshot(collection(db, 'trainings'), (snapshot) => {
      setTrainings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Training)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'trainings'));

    setLoading(false);

    return () => {
      unsubProfile();
      unsubInvestments();
      unsubCooperative();
      unsubOrders();
      unsubRegistrations();
      unsubPayments();
      unsubTrainings();
    };
  }, [user]);

  const handlePayMonthlyDue = async () => {
    if (!cooperative) return;
    setProcessingDue(true);
    try {
      await simulatePayment(MONTHLY_DUE, 'Cooperative Monthly Due', user.uid);
      // User is redirected to Korapay.
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed.');
    } finally {
      setProcessingDue(false);
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const recentPayments = payments.slice(0, 5);

  // Chart Data
  const paymentData = payments.slice(0, 6).reverse().map(p => ({
    name: format(p.createdAt.toDate(), 'MMM d'),
    amount: p.amount
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">Welcome back, {profile?.displayName?.split(' ')[0] || 'Member'}!</h1>
          <p className="text-gray-500 text-[10px]">Here's what's happening with your account today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-green-500 w-48"
            />
          </div>
          <button className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center font-bold text-green-700 text-xs">
            {profile?.displayName?.[0] || 'U'}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                      <Wallet className="text-green-600 w-3.5 h-3.5" />
                    </div>
                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className="text-[8px] font-bold text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded-md"
                    >
                      Fund
                    </button>
                  </div>
                  <p className="text-gray-500 text-[9px] font-medium">Wallet Balance</p>
                  <h3 className="text-base font-bold text-gray-900">NGN {(profile?.walletBalance || 0).toLocaleString()}</h3>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-blue-600 w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">+12.5%</span>
                  </div>
                  <p className="text-gray-500 text-[9px] font-medium">Total Invested</p>
                  <h3 className="text-base font-bold text-gray-900">NGN {totalInvested.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-blue-600 w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{payments.length} Records</span>
                  </div>
                  <p className="text-gray-500 text-[9px] font-medium">Total Payments</p>
                  <h3 className="text-base font-bold text-gray-900">NGN {totalPayments.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="text-orange-600 w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">{orders.length} Orders</span>
                  </div>
                  <p className="text-gray-500 text-[9px] font-medium">Rice Purchases</p>
                  <h3 className="text-base font-bold text-gray-900">NGN {orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}</h3>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                      <GraduationCap className="text-purple-600 w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">{registrations.length} Active</span>
                  </div>
                  <p className="text-gray-500 text-[9px] font-medium">Training Programs</p>
                  <h3 className="text-base font-bold text-gray-900">{registrations.length} Registered</h3>
                </div>
              </div>

              {/* Charts & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-xs">Payment History</h3>
                    <select className="bg-gray-50 border-none rounded-lg text-[9px] font-bold text-gray-600 px-2 py-1">
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={paymentData}>
                        <defs>
                          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#15803d" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} tickFormatter={(v) => `N${v/1000}k`} />
                        <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#15803d" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Cooperative Dues</h3>
                  {cooperative ? (
                    <div className="space-y-3 flex-grow">
                      <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                        <p className="text-green-800 text-[10px] mb-0.5">Monthly Subscription</p>
                        <h4 className="text-lg font-bold text-green-700">NGN {MONTHLY_DUE.toLocaleString()}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500">Last Payment</span>
                          <span className="font-bold text-gray-900">
                            {cooperative.lastMonthlyPayment ? format(cooperative.lastMonthlyPayment.toDate(), 'MMM d, yyyy') : 'No record'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500">Status</span>
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md font-bold text-[8px] uppercase">Up to date</span>
                        </div>
                      </div>
                      <motion.button
                        onClick={handlePayMonthlyDue}
                        disabled={processingDue}
                        whileHover={{ scale: 1.02 }}
                        className="w-full mt-auto bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800 transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{processingDue ? 'Processing...' : 'Pay Monthly Due'}</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="text-gray-400 w-8 h-8" />
                      </div>
                      <p className="text-gray-500 text-sm">You are not a member of the cooperative yet.</p>
                      <button className="text-green-700 font-bold hover:underline">Join Cooperative</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
                  <button className="text-green-700 font-bold text-sm hover:underline flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">Transaction</th>
                        <th className="px-8 py-4">Amount</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                              </div>
                              <span className="font-bold text-gray-900">{payment.purpose}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 font-bold text-gray-900">NGN {payment.amount.toLocaleString()}</td>
                          <td className="px-8 py-5 text-gray-500 text-sm">{format(payment.createdAt.toDate(), 'MMM d, yyyy')}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              payment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={() => generateReceiptPDF(payment, profile)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Constitution & Bye-Laws */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="text-orange-600 w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Constitution</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-grow">Official salvagebizhub Cooperative Constitution and operational guidelines.</p>
                  <button 
                    onClick={() => generateConstitutionPDF(profile)}
                    className="w-full bg-gray-50 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="text-orange-600 w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Bye-Laws</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-grow">Rules and regulations governing members of the salvagebizhub Cooperative.</p>
                  <button 
                    onClick={() => generateByeLawsPDF(profile)}
                    className="w-full bg-gray-50 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Cooperative Membership */}
                {cooperative && (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                      <CheckCircle className="text-blue-600 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Membership Status</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">Official confirmation of your active membership in the salvagebizhub Cooperative.</p>
                    <button 
                      onClick={() => generateConstitutionPDF(profile)} // Reusing constitution as a placeholder for status
                      className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Status</span>
                    </button>
                  </div>
                )}

                {/* Investment Documents */}
                {investments.map((inv) => (
                  <div key={inv.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="text-green-600 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Investment Certificate</h3>
                    <p className="text-xs text-gray-400 mb-4">{inv.plan} - {inv.slots} Slots</p>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">Official certificate for your investment in salvagebizhub Rice.</p>
                    <button 
                      onClick={() => generateInvestmentPDF(inv, profile)}
                      className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Certificate</span>
                    </button>
                  </div>
                ))}

                {/* Training Passes */}
                {registrations.map((reg) => {
                  const training = trainings.find(t => t.id === reg.trainingId);
                  return (
                    <div key={reg.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                        <GraduationCap className="text-purple-600 w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">Training Pass</h3>
                      <p className="text-xs text-gray-400 mb-4">{training?.title || 'Training Program'}</p>
                      <p className="text-gray-500 text-sm mb-6 flex-grow">Your entry pass for the upcoming training session.</p>
                      <button 
                        onClick={() => training && generateTrainingPassPDF(reg, training, profile)}
                        className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition-all flex items-center justify-center space-x-2 shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Pass</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50">
                <h3 className="font-bold text-gray-900 text-lg">All Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-8 py-4">Transaction ID</th>
                      <th className="px-8 py-4">Purpose</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 font-mono text-xs text-gray-400">{payment.id}</td>
                        <td className="px-8 py-5 font-bold text-gray-900">{payment.purpose}</td>
                        <td className="px-8 py-5 font-bold text-gray-900">NGN {payment.amount.toLocaleString()}</td>
                        <td className="px-8 py-5 text-gray-500 text-sm">{format(payment.createdAt.toDate(), 'MMM d, yyyy')}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            payment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <button 
                            onClick={() => generateReceiptPDF(payment, profile)}
                            className="text-green-700 font-bold text-xs hover:underline flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <FundWallet userId={user.uid} />
              
              <div className="mt-8 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Wallet Transactions</h3>
                <div className="space-y-4">
                  {payments.filter(p => p.purpose === 'wallet_funding').length > 0 ? (
                    payments.filter(p => p.purpose === 'wallet_funding').map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            payment.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Wallet Funding</p>
                            <p className="text-xs text-gray-500">{format(payment.createdAt.toDate(), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">+NGN {payment.amount.toLocaleString()}</p>
                          <p className={`text-[10px] font-bold uppercase ${
                            payment.status === 'success' ? 'text-green-600' : 'text-orange-600'
                          }`}>{payment.status}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No wallet transactions yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center font-bold text-3xl text-green-700 mb-4">
                  {profile?.displayName?.[0] || 'U'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.displayName}</h2>
                <p className="text-gray-500">{profile?.email}</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Account Role</p>
                    <p className="font-bold text-gray-900 uppercase">{profile?.role}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Member Since</p>
                    <p className="font-bold text-gray-900">
                      {profile?.createdAt ? format(profile.createdAt.toDate(), 'MMMM yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                  <p className="font-bold text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
                </div>

                <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md">
                  Edit Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
