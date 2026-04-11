import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

async function checkKorapayAccount() {
  try {
    console.log("Checking Korapay account limits and transactions...\n");

    // Try to get merchant info
    const response = await axios.get(
      "https://api.korapay.com/merchant/api/v1/merchant/details",
      {
        headers: {
          Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    console.log("✅ Merchant Account Details:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("\n❌ ERROR Checking Account:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      console.error("\nThis could indicate:");
      console.error("- Daily transaction limit reached");
      console.error("- Daily amount limit reached");
      console.error("- Account restrictions active");
      console.error("- API key issues");
    } else {
      console.error("Message:", error.message);
    }
  }

  // Try a test transaction to see specific error
  console.log("\n\n--- Testing Transaction ---\n");
  try {
    const payload = {
      amount: 100000, // 1000 NGN
      currency: "NGN",
      customer: {
        email: "diagnostic@salvagebizhub.com",
        name: "Diagnostic Test"
      },
      reference: `diagnostic_${Date.now()}`,
      notification_url: "https://www.salvagebizhub.com/api/kora-webhook",
      redirect_url: "https://www.salvagebizhub.com/payment-status"
    };

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
      console.log("✅ Transaction initialized successfully");
      console.log("Checkout URL:", response.data.data.checkout_url);
    } else {
      console.log("❌ Transaction failed:");
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error("❌ Transaction Error:");
    if (error.response?.data?.message) {
      console.error("Message:", error.response.data.message);
      console.error("\nThis is the exact error your users are seeing!");
    }
    console.error(JSON.stringify(error.response?.data, null, 2));
  }
}

checkKorapayAccount();
