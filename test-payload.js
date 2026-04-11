import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

async function testPaymentRequest() {
  try {
    console.log("🔍 Testing what gets sent to Korapay...\n");

    // Simulate what the app sends
    const testAmounts = [
      { label: "Rice 33kg", amount: 33000 },
      { label: "Investment Slot", amount: 50000 },
      { label: "Monthly Due", amount: 2000 },
      { label: "Investment Reg Fee", amount: 5000 }
    ];

    for (const test of testAmounts) {
      const KoboAmount = test.amount * 100;
      console.log(`📦 ${test.label}`);
      console.log(`   NGN Amount: ${test.amount.toLocaleString()}`);
      console.log(`   Kobo (sent to Korapay): ${KoboAmount.toLocaleString()}`);
      console.log(`   Over 1 million kobo? ${KoboAmount > 1000000 ? '⚠️ YES' : '✅ No'}`);
      console.log();
    }

    console.log("=".repeat(50));
    console.log("\n🧪 Test Actual Request to Korapay...\n");

    const payload = {
      amount: 33000 * 100, // This is what server sends
      currency: "NGN",
      customer: { 
        email: "test@salvagebizhub.com",
        name: "Test User"
      },
      reference: `test_${Date.now()}`,
      notification_url: "https://www.salvagebizhub.com/api/kora-webhook",
      redirect_url: "https://www.salvagebizhub.com/payment-status",
    };

    console.log("Payload being sent to Korapay:");
    console.log(JSON.stringify(payload, null, 2));
    console.log();

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

    if (response.data.status === true) {
      console.log("✅ Korapay accepted the request");
      console.log(`Checkout URL: ${response.data.data.checkout_url}`);
    } else {
      console.log("❌ Korapay rejected the request:");
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testPaymentRequest();
