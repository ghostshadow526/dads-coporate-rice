import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

async function testKorapay() {
  try {
    console.log("Testing Korapay API...");
    console.log("Secret Key:", KORAPAY_SECRET_KEY.substring(0, 10) + "...");

    // Test a small transaction init
    const payload = {
      amount: 50000, // 500 NGN
      currency: "NGN",
      customer: {
        email: "test@example.com",
        name: "Test Customer"
      },
      reference: `test_ref_${Date.now()}`,
      notification_url: "https://www.salvagebizhub.com/api/kora-webhook",
      redirect_url: "https://www.salvagebizhub.com/payment-status"
    };

    console.log("\nPayload:", JSON.stringify(payload, null, 2));

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

    console.log("\nResponse Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("\n❌ ERROR:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
}

testKorapay();
