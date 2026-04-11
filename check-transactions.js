import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

async function getRecentTransactions() {
  try {
    console.log("Fetching recent transactions from Korapay...\n");

    // Try multiple pages of transactions
    for (let page = 1; page <= 3; page++) {
      try {
        const response = await axios.get(
          `https://api.korapay.com/merchant/api/v1/charges?page=${page}&per_page=10`,
          {
            headers: {
              Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
              "Content-Type": "application/json"
            },
          }
        );

        console.log(`\n=== Page ${page} Transactions ===`);
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach(transaction => {
            console.log(`
Status: ${transaction.status}
Reference: ${transaction.reference}
Amount: ${transaction.amount / 100} NGN
Customer: ${transaction.customer?.email}
Created: ${transaction.created_at}
Message: ${transaction.message || 'N/A'}
            `);
          });
        } else {
          console.log("No transactions found on this page");
          break;
        }
      } catch (err) {
        console.log(`Page ${page} not available or error:`, err.response?.status);
        break;
      }
    }
  } catch (error) {
    console.error("\n❌ ERROR:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }
  }
}

getRecentTransactions();
