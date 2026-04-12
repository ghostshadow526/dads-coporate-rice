import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import axios from 'axios';

let db: Firestore;
let initialized = false;

// Initialize Firebase Admin (prefers FIREBASE_SERVICE_ACCOUNT JSON, falls back to split vars)
const initializeFirebase = () => {
  if (initialized) return;

  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
      const creds = JSON.parse(serviceAccountJson);
      // The private key needs to be un-escaped
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
      console.log('Firebase initialized successfully for project:', creds.project_id);
      return;
    }

    // Fallback: use individual env vars (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey?.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase environment variables: set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
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
    console.log('Firebase initialized successfully for project:', projectId);
  } catch (e) {
    console.error('Firebase init error:', e);
    throw e;
  }
};

// MANDATORY: Auto-create user if doesn't exist
const ensureUserExists = async (userId: string, email: string, displayName?: string) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.log(`Creating new user: ${userId}`);
      await userRef.set({
        uid: userId,
        email: email || null,
        displayName: displayName || 'User',
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      });
    }

    return userRef;
  } catch (error: any) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
};

// Check daily transaction limit using Firestore
const checkDailyLimit = async (userId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const limitDocId = `${userId}_${today}`;
  
  const limitDoc = await db.collection('transaction_limits').doc(limitDocId).get();
  
  if (!limitDoc.exists) {
    await db.collection('transaction_limits').doc(limitDocId).set({
      userId,
      date: today,
      count: 1,
      createdAt: new Date().toISOString(),
    });
    return true;
  }
  
  const data = limitDoc.data();
  if (data.count >= 10) {
    return false;
  }
  
  await db.collection('transaction_limits').doc(limitDocId).update({
    count: data.count + 1,
  });
  
  return true;
};

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    try {
      initializeFirebase();
    } catch (fbError: any) {
      return res.status(500).json({ 
        error: 'Firebase not configured',
        details: fbError.message 
      });
    }

    const { userId, amount, purpose = 'wallet_funding', metadata = {} } = req.body;

    console.log(`Initializing payment for user ${userId}, amount: ${amount}, purpose: ${purpose}`);

    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount are required' });
    }

    // Check daily transaction limit
    const canTransact = await checkDailyLimit(userId);
    if (!canTransact) {
      return res.status(429).json({
        error: 'Limit exceeded',
        details: 'You have exceeded the daily transaction limit (max 10 per day). Please try again tomorrow.',
        retryAfter: 86400,
      });
    }

    // Extract email and displayName from metadata
    let email = metadata.email || '';
    let displayName = metadata.displayName || 'User';

    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // MANDATORY: Ensure user exists before processing payment
    await ensureUserExists(userId, email, displayName);

    // Generate unique reference
    const reference = `ref_${userId}_${Date.now()}`;

    // Save transaction in DB
    await db.collection('payments').doc(reference).set({
      id: reference,
      userId,
      email,
      amount,
      purpose,
      metadata,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Initialize Korapay transaction
    const korapayKey = process.env.KORAPAY_SECRET_KEY;
    if (!korapayKey) {
      return res.status(500).json({ error: 'Korapay not configured' });
    }

    const korapayResponse = await axios.post(
      'https://api.korapay.com/merchant/api/v1/charges/initialize',
      {
        amount: Math.round(amount * 100),
        currency: 'NGN',
        reference,
        redirect_url: `${process.env.APP_URL || 'https://www.salvagebizhub.com'}/payment-status?ref=${reference}`,
        customer: {
          name: displayName,
          email,
        },
        metadata: {
          userId: userId,
          purpose: purpose,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${korapayKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checkoutUrl = korapayResponse.data.data?.checkout_url;

    if (checkoutUrl) {
      return res.status(200).json({
        success: true,
        checkout_url: checkoutUrl,
        reference,
      });
    } else {
      throw new Error('Korapay did not return checkout URL');
    }
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return res.status(500).json({
      error: error.message || 'Payment initialization failed',
    });
  }
};
