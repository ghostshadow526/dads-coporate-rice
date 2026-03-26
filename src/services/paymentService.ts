export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  purpose: string;
  timestamp: string;
}

export const simulatePayment = async (amount: number, purpose: string, uid: string): Promise<PaymentResponse> => {
  const response = await fetch('/api/payments/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, purpose, uid }),
  });

  if (!response.ok) {
    throw new Error('Payment simulation failed');
  }

  return response.json();
};
