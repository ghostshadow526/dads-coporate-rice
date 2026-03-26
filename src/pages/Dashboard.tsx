import { useState, useEffect } from 'react';
import { FirebaseUser, db, collection, query, where, onSnapshot, orderBy, Timestamp } from '../firebase';
import { UserProfile, Investment, CooperativeMember, RiceOrder, TrainingRegistration, PaymentRecord } from '../types';
import { motion } from 'motion/react';
import { FileText, CreditCard, User, Download, ExternalLink, Calendar, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { format } from 'date-fns';
import { generateInvestmentPDF, generateReceiptPDF, generateTrainingPassPDF } from '../services/pdfService';
import { toast } from 'sonner';

interface DashboardProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'payments' | 'profile'>('documents');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [cooperative, setCooperative] = useState<CooperativeMember | null>(null);
  const [orders, setOrders] = useState<RiceOrder[]>([]);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const qInvestments = query(collection(db, 'investments'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const qCooperative = query(collection(db, 'cooperativeMembers'), where('uid', '==', user.uid));
    const qOrders = query(collection(db, 'riceOrders'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const qRegistrations = query(collection(db, 'trainingRegistrations'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    const qPayments = query(collection(db, 'payments'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubInvestments = onSnapshot(qInvestments, (snapshot) => {
      setInvestments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investment)));
    });

    const unsubCooperative = onSnapshot(qCooperative, (snapshot) => {
      if (!snapshot.empty) {
        setCooperative({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CooperativeMember);
      }
    });

    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RiceOrder)));
    });

    const unsubRegistrations = onSnapshot(qRegistrations, (snapshot) => {
      setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingRegistration)));
    });

    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord)));
      setLoading(false);
    });

    return () => {
      unsubInvestments();
      unsubCooperative();
      unsubOrders();
      unsubRegistrations();
      unsubPayments();
    };
  }, [user]);

  const handleDownloadInvestment = (investment: Investment) => {
    generateInvestmentPDF(investment, profile);
    toast.success('Investment document downloaded!');
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    generateReceiptPDF(payment, profile);
    toast.success('Receipt downloaded!');
  };

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {profile?.displayName || 'User'}</h1>
        <p className="text-gray-600">Manage your investments, cooperative membership, and orders.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          {activeTab === 'documents' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-green-700" />
                <span>Your Documents</span>
              </h2>

              {/* Investment Documents */}
              {investments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Investment Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investments.map((inv) => (
                      <div key={inv.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{inv.plan}</p>
                            <p className="text-xs text-gray-500">{format(inv.createdAt.toDate(), 'PPP')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadInvestment(inv)}
                          className="p-2 text-green-700 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cooperative Membership */}
              {cooperative && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cooperative Documents</h3>
                  <div className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Cooperative Membership</p>
                        <p className="text-xs text-gray-500">Status: {cooperative.status.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a href="#" className="p-2 text-green-700 hover:bg-green-50 rounded-full transition-colors" title="Download Constitution">
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Training Passes */}
              {registrations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Training Passes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-purple-50 rounded-xl">
                            <Calendar className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Training Pass</p>
                            <p className="text-xs text-gray-500">ID: {reg.paymentId}</p>
                          </div>
                        </div>
                        <button className="p-2 text-green-700 hover:bg-green-50 rounded-full transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {investments.length === 0 && !cooperative && registrations.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents found yet. Start by investing or joining the cooperative!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-green-700" />
                <span>Payment History</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="pb-4 font-bold">Purpose</th>
                      <th className="pb-4 font-bold">Amount</th>
                      <th className="pb-4 font-bold">Date</th>
                      <th className="pb-4 font-bold">Status</th>
                      <th className="pb-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-medium text-gray-900">{payment.purpose}</td>
                        <td className="py-4 text-gray-600">NGN {payment.amount.toLocaleString()}</td>
                        <td className="py-4 text-gray-500">{format(payment.createdAt.toDate(), 'PP')}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            payment.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-green-700 hover:text-green-800 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="text-center py-20 text-gray-500">No payments found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <User className="w-6 h-6 text-green-700" />
                <span>Your Profile</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-medium text-gray-900">{profile?.displayName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <p className="text-lg font-medium text-gray-900">{profile?.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <p className="text-lg font-medium text-gray-900">{profile?.phoneNumber || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
                  <p className="text-lg font-medium text-gray-900">{profile?.createdAt ? format(profile.createdAt.toDate(), 'PPP') : 'N/A'}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
