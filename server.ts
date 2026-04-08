import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import crypto from "crypto";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let firebaseConfig: any;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  firebaseConfig = JSON.parse(readFileSync(configPath, "utf8"));
} catch (e) {
  console.error("Failed to load firebase-applet-config.json", e);
}

if (!admin.apps.length) {
  // Initialize with no arguments to use Application Default Credentials (ADC)
  // This is the most reliable way in Cloud Run to avoid PERMISSION_DENIED
  admin.initializeApp();
}

const databaseId = firebaseConfig?.firestoreDatabaseId || "(default)";
const db = getFirestore(databaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use raw body for webhook signature verification
  app.use("/api/kora-webhook", express.raw({ type: "application/json" }));
  app.use(express.json());

  // Korapay Config - must be set via environment variables
  const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
  const KORAPAY_PUBLIC_KEY = process.env.KORAPAY_PUBLIC_KEY;
  const KORAPAY_ENCRYPTION_KEY = process.env.KORAPAY_ENCRYPTION_KEY;
  
  if (!KORAPAY_SECRET_KEY || !KORAPAY_PUBLIC_KEY || !KORAPAY_ENCRYPTION_KEY) {
    console.warn("Warning: Korapay API keys are not fully configured. Please set KORAPAY_SECRET_KEY, KORAPAY_PUBLIC_KEY, and KORAPAY_ENCRYPTION_KEY environment variables.");
  }

  console.log("Korapay initialized with secret key:", KORAPAY_SECRET_KEY.substring(0, 7) + "...");

  // API routes
  app.get("/api/health", async (req, res) => {
    try {
      // Test DB connection
      await db.collection("health").doc("check").set({ lastCheck: new Date().toISOString() });
      res.json({ status: "ok", database: "connected" });
    } catch (error: any) {
      console.error("Health check failed:", error.message);
      res.status(500).json({ status: "error", message: error.message });
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
  app.post("/api/fund-wallet", async (req, res) => {
    try {
      const { userId, amount, purpose = "wallet_funding" } = req.body;

      console.log(`Initializing payment for user ${userId}, amount: ${amount}, purpose: ${purpose}`);

      if (!userId || !amount) {
        return res.status(400).json({ error: "userId and amount are required" });
      }

      // Fetch user email from DB
      console.log(`Fetching user doc for UID: ${userId} from collection: users`);
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        console.error(`User not found in Firestore: ${userId}`);
        return res.status(404).json({ error: "User not found" });
      }
      const userData = userDoc.data();
      const email = userData?.email;

      if (!email) {
        console.error(`User email missing for user: ${userId}`);
        return res.status(400).json({ error: "User email not found" });
      }

      // Generate unique reference
      const reference = `ref_${userId}_${Date.now()}`;

      // Save transaction in DB
      await db.collection("payments").doc(reference).set({
        id: reference,
        uid: userId,
        amount: Number(amount),
        purpose: purpose,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Clean up APP_URL to avoid double slashes
      let baseUrl = process.env.APP_URL || "http://localhost:3000";
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
        res.status(500).json({ 
          error: "Failed to initialize payment with Korapay",
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

        // Update transaction status
        await db.collection("payments").doc(reference).update({
          status: "success",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Credit user wallet
        const userId = paymentData?.uid;
        const amountInNaira = amount / 100;

        if (userId) {
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
