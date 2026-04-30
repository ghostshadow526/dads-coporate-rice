import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import axios from 'axios';

let db: Firestore;
let initialized = false;

const initializeFirebase = () => {
  if (initialized) return;

  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
      const creds = JSON.parse(serviceAccountJson);
      creds.private_key = creds.private_key.replace(/\\n/g, '\n');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(creds),
        });
      }

      db = new Firestore({
        projectId: creds.project_id,
        credentials: {
            client_email: creds.client_email,
            private_key: creds.private_key,
        },
        databaseId: process.env.VITE_FIREBASE_DATABASE_ID,
      });

      initialized = true;
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey?.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase environment variables');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    db = new Firestore({
        projectId,
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        databaseId: process.env.VITE_FIREBASE_DATABASE_ID,
    });
    initialized = true;
  } catch (e) {
    console.error('Firebase init error:', e);
    throw e;
  }
};

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    initializeFirebase();

    const { reference } = req.query;

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    const korapayKey = process.env.KORAPAY_SECRET_KEY;
    if (!korapayKey) {
      return res.status(500).json({ error: 'Korapay not configured' });
    }

    const korapayResponse = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapayKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentData = korapayResponse.data.data;
    const { status, amount } = paymentData;

    const paymentRef = db.collection('payments').doc(reference);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const payment = paymentDoc.data();
    const { userId } = payment;

    if (status === 'success') {
      if (payment.status !== 'success') {
        await paymentRef.update({ status: 'success' });

        const userRef = db.collection('users').doc(userId);
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            throw new Error('User not found');
          }
          const newBalance = (userDoc.data().walletBalance || 0) + amount;
          transaction.update(userRef, { walletBalance: newBalance });
        });
      }
      return res.status(200).json({ status: true, data: paymentData, message: 'Payment successful' });
    } else {
      await paymentRef.update({ status: 'failed' });
      return res.status(400).json({ status: false, data: paymentData, message: 'Payment failed or pending' });
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    const status = error?.response?.status || 500;
    const gatewayData = error?.response?.data;
    return res.status(status).json({
      error: error?.message || 'Payment verification failed',
      gateway: gatewayData || null,
    });
  }
};
