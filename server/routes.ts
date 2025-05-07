import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { 
  generateChatResponse, 
  generateDocumentSummary, 
  generateContract, 
  checkBusinessCompliance 
} from "./openai";

// Initialize Daraja API credentials
const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
const shortCode = process.env.MPESA_SHORTCODE || "";
const passkey = process.env.MPESA_PASSKEY || "";
const callbackUrl = process.env.MPESA_CALLBACK_URL || "https://example.com/callback";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint (OpenAI integration)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language = "en" } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages are required and must be an array" });
      }
      
      // Generate response using our OpenAI service
      const generatedText = await generateChatResponse(messages, language);
      
      // Extract source citation if present (simplified example)
      const sourceMatch = generatedText.match(/Source: ([^\.]+)/);
      const source = sourceMatch ? sourceMatch[1] : undefined;
      
      return res.json({ 
        text: generatedText,
        source: source
      });
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate legal advice" });
    }
  });

  // Legal document search
  app.get("/api/legal-documents/search", async (req, res) => {
    try {
      const { query, type, limit } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      // This would normally search a database of legal documents
      // For now, return mock results (in a real implementation, this would be real data)
      const results = await storage.searchLegalDocuments(
        query as string,
        type as string | undefined,
        parseInt(limit as string) || 10
      );
      
      return res.json(results);
    } catch (error: any) {
      console.error("Legal document search error:", error);
      return res.status(500).json({ error: error.message || "Failed to search legal documents" });
    }
  });

  // Document summary generation
  app.get("/api/legal-documents/:id/summary", async (req, res) => {
    try {
      const { id } = req.params;
      const { language = "en" } = req.query;
      
      // Get document from storage
      const document = await storage.getLegalDocumentById(parseInt(id));
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      // Generate summary using our OpenAI service
      const summary = await generateDocumentSummary(document.content, language as string);
      
      return res.json(summary);
    } catch (error: any) {
      console.error("Document summary error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate document summary" });
    }
  });

  // Contract generation
  app.post("/api/contracts/generate", async (req, res) => {
    try {
      const { contractType, details, language = "en" } = req.body;
      
      if (!contractType) {
        return res.status(400).json({ error: "Contract type is required" });
      }
      
      // Generate contract using our OpenAI service
      const contractText = await generateContract(contractType, details, language);
      
      return res.json(contractText);
    } catch (error: any) {
      console.error("Contract generation error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate contract" });
    }
  });

  // Business compliance check
  app.post("/api/compliance/check", async (req, res) => {
    try {
      const { industry, businessDetails, language = "en" } = req.body;
      
      if (!industry) {
        return res.status(400).json({ error: "Business industry is required" });
      }
      
      // Generate compliance check using our OpenAI service
      const complianceData = await checkBusinessCompliance(industry, businessDetails, language);
      
      return res.json(JSON.parse(complianceData));
    } catch (error: any) {
      console.error("Compliance check error:", error);
      return res.status(500).json({ error: error.message || "Failed to check compliance" });
    }
  });

  // M-Pesa payment initiation
  app.post("/api/payments/mpesa", async (req, res) => {
    try {
      const { amount, phoneNumber, planName } = req.body;
      
      if (!amount || !phoneNumber) {
        return res.status(400).json({ error: "Amount and phone number are required" });
      }
      
      // Authenticate with Daraja API
      const auth = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`,
          },
        }
      );
      
      const accessToken = auth.data.access_token;
      
      // Format timestamp (YYYYMMDDHHmmss)
      const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
      
      // Create password (shortcode + passkey + timestamp)
      const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
      
      // STK Push request
      const stkPushResponse = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortCode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: "WakiliAI",
          TransactionDesc: `Subscription to ${planName} plan`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Store payment request in database
      const payment = await storage.createPayment({
        userId: 1, // Would normally be the authenticated user's ID
        amount,
        currency: "KES",
        status: "pending",
        planType: planName,
        phoneNumber,
      });
      
      return res.json({
        success: true,
        message: "Payment initiated",
        checkoutRequestID: stkPushResponse.data.CheckoutRequestID,
        paymentId: payment.id,
      });
    } catch (error: any) {
      console.error("M-Pesa payment error:", error);
      return res.status(500).json({ 
        success: false,
        error: error.message || "Failed to initiate payment" 
      });
    }
  });

  // M-Pesa callback (would be used to update payment status)
  app.post("/api/payments/mpesa/callback", async (req, res) => {
    try {
      const { Body } = req.body;
      
      // Update payment status in database
      if (Body.stkCallback.ResultCode === 0) {
        // Payment successful
        // Update payment status in database (would use transaction ID and other details)
      } else {
        // Payment failed
        // Update payment status with failure reason
      }
      
      return res.json({ success: true });
    } catch (error: any) {
      console.error("M-Pesa callback error:", error);
      return res.status(500).json({ error: error.message || "Callback processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
