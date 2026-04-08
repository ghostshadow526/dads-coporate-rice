export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  purpose: string;
  timestamp: string;
}

export const simulatePayment = async (amount: number, purpose: string, uid: string, metadata: any = {}): Promise<PaymentResponse> => {
  // We're now using real Korapay initialization for all payments
  try {
    const response = await fetch('/api/fund-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: uid, amount, purpose, metadata }),
    });

    const data = await response.json();

    if (data.checkout_url) {
      // Redirect to Korapay checkout
      window.location.href = data.checkout_url;
      
      // Return a "pending" response since the user is being redirected
      return {
        success: true,
        transactionId: 'redirecting',
        amount,
        purpose,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error(data.error || 'Payment initialization failed');
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    throw new Error(error.message || 'Payment initialization failed');
  }
};
