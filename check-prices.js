import axios from 'axios';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function checkDatabasePrices() {
  try {
    // Initialize Firebase Admin
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const firebaseConfig = JSON.parse(readFileSync(configPath, "utf8"));
    
    // Use environment variable for service account credentials
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
    }
    
    const serviceAccountKey = JSON.parse(serviceAccountJson);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        projectId: firebaseConfig.projectId,
      });
    }

    const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
    const db = getFirestore(databaseId);

    console.log("Checking Database Prices...\n");

    // Check trainings
    console.log("=== TRAININGS ===");
    const trainingsSnapshot = await db.collection("trainings").get();
    if (trainingsSnapshot.empty) {
      console.log("No trainings found");
    } else {
      trainingsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`Title: ${data.title}`);
        console.log(`Price: ${data.price} ${typeof data.price}`);
        console.log(`Price in millions? ${data.price > 1000000 ? 'YES ⚠️' : 'No'}`);
        console.log("---");
      });
    }

    // Check investments
    console.log("\n=== INVESTMENTS (User Records) ===");
    const investmentsSnapshot = await db.collection("investments").limit(3).get();
    investmentsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Amount: ${data.amount} ${typeof data.amount}`);
      console.log(`Amount in millions? ${data.amount > 1000000 ? 'YES ⚠️' : 'No'}`);
      console.log("---");
    });

    // Check rice orders
    console.log("\n=== RICE ORDERS (User Records) ===");
    const riceSnapshot = await db.collection("riceOrders").limit(3).get();
    if (riceSnapshot.empty) {
      console.log("No rice orders found");
    } else {
      riceSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`Total Amount: ${data.totalAmount}`);
        console.log(`Items: ${JSON.stringify(data.items)}`);
        console.log("---");
      });
    }

    // Check payments
    console.log("\n=== PAYMENTS (Recent) ===");
    const paymentsSnapshot = await db.collection("payments").orderBy('createdAt', 'desc').limit(5).get();
    if (paymentsSnapshot.empty) {
      console.log("No payments found");
    } else {
      paymentsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${data.id}`);
        console.log(`Purpose: ${data.purpose}`);
        console.log(`Amount: ${data.amount} ${typeof data.amount}`);
        console.log(`Status: ${data.status}`);
        console.log(`Amount in millions? ${data.amount > 1000000 ? 'YES ⚠️' : 'No'}`);
        console.log("---");
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDatabasePrices();
