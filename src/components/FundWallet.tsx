import { useState } from 'react';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface FundWalletProps {
  userId: string;
}

export default function FundWallet({ userId }: FundWalletProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLimitError, setShowLimitError] = useState(false);

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setShowLimitError(false);
    try {
      const response = await axios.post('/api/fund-wallet', {
        userId,
        amount: Number(amount),
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        toast.error(response.data.details || 'Failed to initialize payment');
      }
    } catch (error: any) {
      console.error('Funding error:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || error.message;
      const isLimitError = error.response?.status === 429 || 
                          error.response?.data?.error?.toLowerCase().includes('limit');
      
      if (isLimitError) {
        setShowLimitError(true);
        toast.error('Daily transaction limit reached');
      } else {
        toast.error(`Payment Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Fund Wallet</h3>
          <p className="text-sm text-gray-500">Add money to your account securely</p>
        </div>
      </div>

      {showLimitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-900">Daily Limit Exceeded</p>
            <p className="text-xs text-red-700">You have reached your daily transaction limit (max 10 transfers per day). Please try again tomorrow.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleFundWallet} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Amount (NGN)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            disabled={loading || showLimitError}
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all outline-none text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || showLimitError}
          className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Initializing...</span>
            </>
          ) : showLimitError ? (
            <span>Limit Exceeded - Try Tomorrow</span>
          ) : (
            <span>Fund Wallet Now</span>
          )}
        </button>
      </form>
    </div>
  );
}
