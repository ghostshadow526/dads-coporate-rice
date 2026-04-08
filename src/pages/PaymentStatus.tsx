import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference found.');
        return;
      }

      try {
        const response = await axios.get(`/api/verify-payment?reference=${reference}`);
        const data = response.data;

        if (data.status === true && data.data.status === 'success') {
          setStatus('success');
          setMessage('Your wallet has been successfully funded.');
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('failed');
        setMessage('An error occurred while verifying your payment.');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl p-12 text-center border border-gray-100">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-brand-orange animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link
              to="/dashboard"
              className="w-full bg-brand-orange text-white py-4 rounded-full font-bold hover:bg-brand-dark transition-all shadow-lg"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Payment Failed</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link
              to="/dashboard"
              className="w-full bg-gray-900 text-white py-4 rounded-full font-bold hover:bg-black transition-all shadow-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
