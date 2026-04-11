import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import path from 'path';

async function cleanupPendingPayments() {
  try {
    // Initialize Firebase
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    const firebaseConfig = JSON.parse(readFileSync(configPath, "utf8"));
    
    const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
    const serviceAccountKey = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        projectId: firebaseConfig.projectId,
      });
    }

    const databaseId = firebaseConfig.firestoreDatabaseId || "(default)";
    const db = getFirestore(databaseId);

    console.log("🧹 Cleaning up pending payments...\n");

    // Get all pending payments
    const pendingSnapshot = await db.collection("payments")
      .where("status", "==", "pending")
      .get();

    console.log(`Found ${pendingSnapshot.size} pending payments\n`);

    if (pendingSnapshot.empty) {
      console.log("✅ No pending payments to clean up");
      process.exit(0);
    }

    // Delete pending payments
    let deleted = 0;
    for (const doc of pendingSnapshot.docs) {
      const data = doc.data();
      console.log(`Deleting pending payment:`);
      console.log(`  ID: ${data.id}`);
      console.log(`  Amount: ${data.amount} NGN`);
      console.log(`  Purpose: ${data.purpose}`);
      
      await db.collection("payments").doc(doc.id).delete();
      deleted++;
      console.log(`  ✅ Deleted\n`);
    }

    console.log(`\n========================================`);
    console.log(`✅ Successfully deleted ${deleted} pending payments`);
    console.log(`========================================`);
    console.log(`\n💡 Now you can try transfers again.`);
    console.log(`💡 Wait ~24 hours before trying large amounts.`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

cleanupPendingPayments();
