import { Timestamp } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  phoneNumber?: string;
  role: 'user';
  walletBalance?: number;
  createdAt: Timestamp;
}

export interface Investment {
  id?: string;
  uid: string;
  plan: string;
  slots: number;
  amount: number;
  status: 'pending' | 'active' | 'completed';
  paymentId: string;
  createdAt: Timestamp;
  fullName: string;
  address: string;
  phone: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  relationship: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface CooperativeMember {
  id?: string;
  uid: string;
  status: 'pending' | 'active' | 'inactive';
  registrationFeePaid: boolean;
  paymentId: string;
  createdAt: Timestamp;
  lastMonthlyPayment?: Timestamp;
}

export interface RiceOrder {
  id?: string;
  uid: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Timestamp;
}

export interface Training {
  id: string;
  title: string;
  description?: string;
  price: number;
  date: Timestamp;
  createdAt: Timestamp;
}

export interface TrainingRegistration {
  id?: string;
  uid: string;
  trainingId: string;
  paymentId: string;
  createdAt: Timestamp;
}

export interface PaymentRecord {
  id: string;
  uid: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Timestamp;
}
