import { toast } from 'sonner';
import type { UserProfile } from '../types';
import { simulatePayment } from './paymentService';

const coerceNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export async function ensureWalletBalanceOrPay(opts: {
  profile: UserProfile | null;
  requiredAmount: number;
  uid: string;
  metadata?: Record<string, any>;
  description?: string;
}): Promise<boolean> {
  const required = coerceNumber(opts.requiredAmount);
  if (required <= 0) return true;

  const currentBalance = coerceNumber(opts.profile?.walletBalance);
  if (currentBalance >= required) return true;

  const shortfall = Math.max(0, required - currentBalance);

  toast.error('Insufficient Wallet Balance', {
    description: opts.description || `Please pay NGN ${shortfall.toLocaleString()} to continue.`,
  });

  try {
    // Redirect to Korapay to fund wallet with the shortfall.
    await simulatePayment(shortfall, 'wallet_funding', opts.uid, opts.metadata || {});
  } catch (error: any) {
    toast.error(error?.message || 'Payment initialization failed. Please try again.');
  }

  return false;
}
