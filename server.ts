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

console.log("Using default Firestore database");
const db = getFirestore();

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
    console.warn("WARNING: KORAPAY_SECRET_KEY is missing. Payments will fail.");
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
    const results: any = {};
    
    try {
      // Test Named DB connection
      await db.collection("health").doc("check").set({ lastCheck: new Date().toISOString() });
      results.namedDb = "connected";
    } catch (error: any) {
      results.namedDb = `error: ${error.message}`;
    }

    try {
      // Test Default DB connection
      const defaultDb = getFirestore("(default)");
      await defaultDb.collection("health").doc("check").set({ lastCheck: new Date().toISOString() });
      results.defaultDb = "connected";
    } catch (error: any) {
      results.defaultDb = `error: ${error.message}`;
    }

    if (results.namedDb === "connected" || results.defaultDb === "connected") {
      res.json({ status: "ok", ...results });
    } else {
      res.status(500).json({ status: "error", ...results });
    }
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

      // Fetch user email from DB
      console.log(`Fetching user doc for UID: ${userId} from collection: users`);
      const userDoc = await db.collection("users").doc(userId).get();
      
      let userData: any;
      let email: string;
      
      if (!userDoc.exists) {
        console.log(`Creating new user: ${userId}`);
        userData = {
          uid: userId,
          email: `${userId}@placeholder.com`,
          displayName: "User",
          walletBalance: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection("users").doc(userId).set(userData);
        email = userData.email;
      } else {
        userData = userDoc.data();
        email = userData?.email || `${userId}@placeholder.com`;
      }

      // Generate unique reference
      const reference = `ref_${userId}_${Date.now()}`;

      // Save transaction in DB
      await db.collection("payments").doc(reference).set({
        id: reference,
        uid: userId,
        amount: Number(amount),
        purpose: purpose,
        metadata: metadata,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (!KORAPAY_SECRET_KEY) {
        console.error("Payment initialization failed: KORAPAY_SECRET_KEY is missing");
        return res.status(500).json({ 
          error: "Payment configuration error", 
          details: "KORAPAY_SECRET_KEY is not set in environment variables." 
        });
      }

      // Clean up baseUrl to avoid double slashes
      let baseUrl = APP_URL;
      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1);
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
