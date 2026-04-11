import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

let db: any;
let initialized = false;

// Initialize Firebase Admin if not already done
const initializeFirebase = () => {
  if (initialized) return;
  
  try {
    // Use environment variable for service account in Vercel
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
    }
    
    const serviceAccountKey = JSON.parse(serviceAccountJson);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        projectId: serviceAccountKey.project_id,
      });
    }
    
    db = getFirestore();
    initialized = true;
  } catch (e) {
    console.error('Firebase init error:', e);
    throw e; // Re-throw to fail early if Firebase isn't configured
  }
};

// Check daily transaction limit using Firestore
const checkDailyLimit = async (userId: string): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const limitDocId = `${userId}_${today}`;
  
  const limitDoc = await db.collection('transaction_limits').doc(limitDocId).get();
  
  if (!limitDoc.exists) {
    // First transaction today, create the limit doc
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
  
  // Increment count
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

    // Fetch user email from DB
    console.log(`Fetching user doc for UID: ${userId} from collection: users`);
    let email = metadata.email || '';
    let displayName = metadata.displayName || 'Customer';
    
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        email = userData?.email || email;
        displayName = userData?.displayName || displayName;
      } else {
        console.warn(`User not found in Firestore, proceeding with metadata: ${userId}`);
      }
    } catch (dbError: any) {
      console.warn(`Error fetching user from DB: ${dbError.message}, proceeding with metadata`);
    }

    if (!email) {
      return res.status(400).json({ error: 'User email is required (provide via metadata.email if user doc does not exist)' });
    }

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
        notification_url: `${process.env.APP_URL || 'https://your-domain.com'}/api/payment-webhook`,
        customer: {
          name: displayName,
          email,
        },
        metadata: {
          userId,
          purpose,
          ...metadata,
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
