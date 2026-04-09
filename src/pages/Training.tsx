import { useState, useEffect } from 'react';
import { FirebaseUser, db, collection, addDoc, query, onSnapshot, orderBy, Timestamp, where } from '../firebase';
import { UserProfile, Training as TrainingType, TrainingRegistration, PaymentRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Calendar, CheckCircle, ArrowRight, DollarSign, Download, Clock, MapPin, Info } from 'lucide-react';
import { simulatePayment } from '../services/paymentService';
import { generateTrainingPassPDF } from '../services/pdfService';
import { sendCompanyNotification } from '../services/notificationService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { handleFirestoreError, OperationType } from '../services/errorService';

interface TrainingProps {
  user: FirebaseUser;
  profile: UserProfile | null;
}

export default function Training({ user, profile }: TrainingProps) {
  const [trainings, setTrainings] = useState<TrainingType[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<TrainingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'trainings'), where('isActive', '==', true), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingType));
      setTrainings(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'trainings'));

    return () => unsubscribe();
  }, [profile, loading]);

  const handleRegister = async () => {
    if (!selectedTraining) return;
    setProcessing(true);
    try {
      await simulatePayment(selectedTraining.price, `Training: ${selectedTraining.title}`, user.uid, { trainingId: selectedTraining.id });
      // User is redirected to Korapay. Webhook handles registration creation.
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900 mb-0.5 tracking-tight uppercase">Agricultural Training Programs</h1>
        <p className="text-gray-500 text-[11px]">Enhance your skills with our expert-led agricultural training sessions.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trainings.map((training) => (
              <div key={training.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-8 flex-grow">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase">{training.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{training.description}</p>
                  
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>{format(training.date.toDate(), 'PPP')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>salvagebizhub Training Center, Abuja</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-2xl font-bold text-purple-700">NGN {training.price.toLocaleString()}</p>
                  <motion.button
                    onClick={() => {
                      setSelectedTraining(training);
                      setStep(2);
                    }}
                    whileHover={{ 
                      borderTopLeftRadius: "2rem",
                      borderBottomRightRadius: "2rem",
                      scale: 1.02
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-purple-700 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-purple-800 transition-all shadow-md"
                  >
                    Register Now
                  </motion.button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 2 && selectedTraining && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 uppercase">
                <Info className="w-6 h-6 text-purple-700" />
                <span>Confirm Registration</span>
              </h2>

              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-2 uppercase">{selectedTraining.title}</h3>
                <p className="text-purple-800 text-sm mb-4">{selectedTraining.description}</p>
                <div className="flex justify-between items-end pt-4 border-t border-purple-200">
                  <span className="text-purple-900 font-bold">Registration Fee:</span>
                  <span className="text-2xl font-bold text-purple-700">NGN {selectedTraining.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <motion.button
                  onClick={handleRegister}
                  disabled={processing}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-purple-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {processing ? 'Processing Payment...' : 'Pay & Confirm Registration'}
                </motion.button>
                <motion.button
                  onClick={() => setStep(1)}
                  disabled={processing}
                  whileHover={{ 
                    borderTopLeftRadius: "2rem",
                    borderBottomRightRadius: "2rem",
                    scale: 1.02
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Back to Trainings
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
            className="text-center space-y-8 py-20 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight uppercase">Registration Successful!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              You have successfully registered for the training program. You can now download your training pass and view registration details in the dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-green-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-md"
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                onClick={() => setStep(1)}
                whileHover={{ 
                  borderTopLeftRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                View Other Trainings
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
