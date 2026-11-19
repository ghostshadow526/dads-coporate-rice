import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import crypto from "crypto";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let firebaseConfig: any;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const { readFileSync } = await import("fs");
  firebaseConfig = JSON.parse(readFileSync(configPath, "utf8"));
  console.log("Loaded Firebase Config for Project:", firebaseConfig.projectId);
} catch (e) {
  console.error("Failed to load firebase-applet-config.json", e);
}

if (!admin.apps.length) {
  const projectId = firebaseConfig?.projectId;
  console.log(`Initializing Firebase Admin with Project ID: ${projectId}`);
  
  // Use environment variable for service account
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountJson) {
    try {
      const serviceAccountKey = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        projectId: projectId,
      });
      console.log("Firebase initialized with service account from environment variable");
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
      admin.initializeApp({
        projectId: projectId,
      });
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set, using default credentials");
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

const databaseId = firebaseConfig?.firestoreDatabaseId;
console.log(`Using Firestore database: ${databaseId || "(default)"}`);
const db = databaseId ? getFirestore(databaseId) : getFirestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use raw body for webhook signature verification
  app.use("/api/kora-webhook", express.raw({ type: "application/json" }));
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Korapay Config
  const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
  const KORAPAY_PUBLIC_KEY = process.env.KORAPAY_PUBLIC_KEY;
  const KORAPAY_ENCRYPTION_KEY = process.env.KORAPAY_ENCRYPTION_KEY;

  if (!KORAPAY_SECRET_KEY) {
    console.warn("WARNING: KORAPAY_SECRET_KEY is missing. Payments will run in simulation mode.");
  } else {
    console.log("Korapay initialized with secret key:", KORAPAY_SECRET_KEY.substring(0, 7) + "...");
  }

  const APP_URL = process.env.APP_URL || "http://localhost:3000";
  console.log("App URL for callbacks:", APP_URL);

  // Daily Transaction Tracking
  const dailyTransactionLimits = new Map<string, { count: number; resetTime: number }>();
  const DAILY_LIMIT_PER_USER = 10; // Max 10 transactions per user per day
  
  function checkDailyLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = dailyTransactionLimits.get(userId);
    
    if (!userLimit || now > userLimit.resetTime) {
      // Reset for new day
      dailyTransactionLimits.set(userId, { count: 1, resetTime: now + (24 * 60 * 60 * 1000) });
      return true;
    }
    
    if (userLimit.count >= DAILY_LIMIT_PER_USER) {
      return false; // Limit exceeded
    }
    
    userLimit.count++;
    return true;
  }

  // API routes
  app.get("/api/health", async (req, res) => {
    const results: any = {
      status: "ok",
      projectId: firebaseConfig?.projectId || null,
      databaseId: databaseId || "(default)",
      serviceAccountConfigured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
      korapayConfigured: Boolean(KORAPAY_SECRET_KEY),
    };

    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        await db.collection("health").doc("check").set({ lastCheck: new Date().toISOString() });
        results.firestoreAdmin = "connected";
      } else {
        results.firestoreAdmin = "ready (no service account credential configured)";
      }
    } catch (error: any) {
      results.firestoreAdmin = `warning: ${error.message}`;
    }

    res.json(results);
  });

  app.get("/api/config", (req, res) => {
    res.json({
      appUrl: process.env.APP_URL || "http://localhost:3000",
    });
  });

  // Simulated payment endpoint (Restored for Monthly Dues and other features)
  app.post("/api/payments/simulate", (req, res) => {
    const { amount, purpose, uid } = req.body;
    console.log(`Simulating payment of ${amount} for ${purpose} by user ${uid}`);
    
    res.json({
      success: true,
      transactionId: `mock_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      amount,
      purpose,
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Payment Initialization API
  app.all("/api/fund-wallet", async (req, res) => {
    if (req.method !== "POST") {
      console.log(`Method ${req.method} not allowed for /api/fund-wallet`);
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }
    try {
      const { userId, amount, purpose = "wallet_funding", metadata = {} } = req.body;

      console.log(`Initializing payment for user ${userId}, amount: ${amount}, purpose: ${purpose}`);

      if (!userId || !amount) {
        return res.status(400).json({ error: "userId and amount are required" });
      }

      // Check daily transaction limit
      if (!checkDailyLimit(userId)) {
        return res.status(429).json({ 
          error: "Limit exceeded",
          details: "You have exceeded the daily transaction limit (max 10 per day). Please try again tomorrow.",
          retryAfter: 86400 // 24 hours in seconds
        });
      }

      // Fetch user email from DB or request metadata
      let userData: any = {
        uid: userId,
        email: metadata?.email || `${userId}@placeholder.com`,
        displayName: metadata?.displayName || "Customer",
        walletBalance: 0,
      };
      let email: string = userData.email;

      try {
        console.log(`Fetching user doc for UID: ${userId} from collection: users`);
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
          console.log(`Creating new user: ${userId}`);
          userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
          await db.collection("users").doc(userId).set(userData).catch(() => {});
        } else {
          userData = userDoc.data() || userData;
          email = userData?.email || email;
        }
      } catch (dbErr: any) {
        console.warn("Firestore Admin user lookup skipped or failed:", dbErr.message);
      }

      // Generate unique reference
      const reference = `ref_${userId}_${Date.now()}`;

      // Save transaction in DB
      try {
        await db.collection("payments").doc(reference).set({
          id: reference,
          uid: userId,
          amount: Number(amount),
          purpose: purpose,
          metadata: metadata,
          status: "pending",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (dbErr: any) {
        console.warn("Firestore Admin payment write skipped or failed:", dbErr.message);
      }

      // Clean up baseUrl to avoid double slashes
      let baseUrl = APP_URL;
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
      }

      if (!KORAPAY_SECRET_KEY) {
        console.warn("KORAPAY_SECRET_KEY not set. Redirecting to simulated payment confirmation.");
        return res.json({
          checkout_url: `${baseUrl}/payment-status?reference=${reference}&status=success`,
          reference,
          mode: "simulation"
        });
      }

      const payload = {
        amount: Number(amount) * 100, // Convert to kobo
        currency: "NGN",
        customer: { 
          email: email,
          name: userData.displayName || "Customer"
        },
        reference: reference,
        notification_url: `${baseUrl}/api/kora-webhook`,
        redirect_url: `${baseUrl}/payment-status`,
      };

      console.log("Calling Korapay with payload:", JSON.stringify(payload, null, 2));

      // Call Korapay API
      const response = await axios.post(
        "https://api.korapay.com/merchant/api/v1/charges/initialize",
        payload,
        {
          headers: {
            Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
        }
      );

      console.log("Korapay response:", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.status === true) {
        res.json({ checkout_url: response.data.data.checkout_url });
      } else {
        res.status(400).json({ 
          error: "Payment initialization failed",
          details: response.data.message || "Unknown error"
        });
      }
    } catch (error: any) {
      console.error("Error initializing payment:", error.response?.data || error.message);
      res.status(500).json({ 
        error: "Internal server error",
        details: error.response?.data?.message || error.message
      });
    }
  });

  // 2. Webhook API (CRITICAL)
  app.post("/api/kora-webhook", async (req, res) => {
    const KORAPAY_WEBHOOK_SECRET = process.env.KORAPAY_WEBHOOK_SECRET;
    
    try {
      const signature = req.headers["x-korapay-signature"];
      const rawBody = req.body.toString();

      if (!signature) {
        return res.status(400).send("Missing signature");
      }

      // Verify signature
      const hash = crypto
        .createHmac("sha256", KORAPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (hash !== signature) {
        console.error("Invalid Korapay signature");
        return res.status(400).send("Invalid signature");
      }

      const payload = JSON.parse(rawBody);
      const { event, data } = payload;

      if (event === "charge.success") {
        const { reference, amount } = data;

        // Find transaction by reference
        const paymentDoc = await db.collection("payments").doc(reference).get();
        
        if (!paymentDoc.exists) {
          console.log(`Transaction not found: ${reference}`);
          return res.status(200).send("OK");
        }

        const paymentData = paymentDoc.data();
        if (paymentData?.status === "success") {
          console.log(`Transaction already processed: ${reference}`);
          return res.status(200).send("OK");
        }

        const { uid: userId, purpose, metadata = {} } = paymentData;
        const amountInNaira = amount / 100;

        // Update transaction status
        await db.collection("payments").doc(reference).update({
          status: "success",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Processing successful payment for user ${userId}, purpose: ${purpose}`);

        // Handle different purposes
        if (purpose === "wallet_funding") {
          const userRef = db.collection("users").doc(userId);
          await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            if (userDoc.exists) {
              const currentBalance = userDoc.data()?.walletBalance || 0;
              t.update(userRef, {
                walletBalance: currentBalance + amountInNaira,
              });
            }
          });
          console.log(`Wallet credited for user ${userId}: ${amountInNaira}`);
        } else if (purpose === "Rice Purchase") {
          await db.collection("riceOrders").add({
            uid: userId,
            items: metadata.cart || [],
            totalAmount: amountInNaira,
            paymentId: reference,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`Rice order created for user ${userId}`);
        } else if (purpose.startsWith("Investment:")) {
          await db.collection("investments").add({
            uid: userId,
            plan: metadata.plan || purpose.split(": ")[1],
            slots: metadata.slots || 1,
            amount: amountInNaira,
            status: "active",
            paymentId: reference,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ...metadata.formData
          });
          console.log(`Investment record created for user ${userId}`);
        } else if (purpose.startsWith("Training:")) {
          await db.collection("trainingRegistrations").add({
            uid: userId,
            trainingId: metadata.trainingId,
            paymentId: reference,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`Training registration created for user ${userId}`);
        } else if (purpose === "Cooperative Registration Fee") {
          await db.collection("cooperativeMembers").add({
            uid: userId,
            status: "active",
            registrationFeePaid: true,
            paymentId: reference,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log(`Cooperative membership created for user ${userId}`);
        } else if (purpose === "Cooperative Monthly Due") {
          const memberQuery = await db.collection("cooperativeMembers").where("uid", "==", userId).limit(1).get();
          if (!memberQuery.empty) {
            await memberQuery.docs[0].ref.update({
              lastMonthlyPayment: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
          console.log(`Monthly due updated for user ${userId}`);
        }
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      // Return 200 to acknowledge receipt even if processing fails internally 
      // (as per "Always return 200" requirement for events)
      return res.status(200).send("OK");
    }
  });

  // 3. Verify API
  app.get("/api/verify-payment", async (req, res) => {
    try {
      const { reference } = req.query;

      if (!reference) {
        return res.status(400).json({ error: "Reference is required" });
      }

      if (!KORAPAY_SECRET_KEY) {
        // Fallback for simulation mode
        try {
          const paymentDoc = await db.collection("payments").doc(reference as string).get();
          if (paymentDoc.exists) {
            const paymentData = paymentDoc.data();
            await db.collection("payments").doc(reference as string).update({
              status: "success",
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            if (paymentData?.uid && paymentData?.amount) {
              const userRef = db.collection("users").doc(paymentData.uid);
              const userDoc = await userRef.get();
              if (userDoc.exists) {
                const currentBalance = userDoc.data()?.walletBalance || 0;
                await userRef.update({ walletBalance: currentBalance + paymentData.amount });
              }
            }
          }
        } catch (dbErr: any) {
          console.warn("Could not update payment in simulation mode:", dbErr.message);
        }

        return res.json({
          status: true,
          message: "Payment verified successfully (simulation mode)",
          data: {
            status: "success",
            reference,
            amount: 0,
          },
        });
      }

      const response = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error("Error verifying payment:", error.response?.data || error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
