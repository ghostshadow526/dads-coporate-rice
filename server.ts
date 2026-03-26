import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/config", (req, res) => {
    res.json({
      appUrl: process.env.APP_URL || "http://localhost:3000",
    });
  });

  // Simulated payment endpoint
  app.post("/api/payments/simulate", (req, res) => {
    const { amount, purpose, uid } = req.body;
    console.log(`Simulating payment of ${amount} for ${purpose} by user ${uid}`);
    
    // In a real app, this would integrate with a payment gateway like Paystack or Flutterwave
    // For this demo, we'll just return a success response with a mock transaction ID
    res.json({
      success: true,
      transactionId: `mock_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      amount,
      purpose,
      timestamp: new Date().toISOString(),
    });
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
