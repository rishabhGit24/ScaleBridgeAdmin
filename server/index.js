const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "https://scale-bridge.vercel.app",
  "https://scale-bridge-admin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

// Middleware - Handle CORS manually for better Vercel compatibility
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Always set CORS headers for allowed origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin && origin.includes("localhost")) {
    // Allow any localhost origin for development
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback to allow the admin frontend domain
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://scale-bridge-admin.vercel.app",
    );
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// MongoDB connection string
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://rishabhbr18_db_user:PuzYMJ38Nn4Pyf2u@cluster0.nzo3fwp.mongodb.net/scalebridge?retryWrites=true&w=majority";

// Global variable to cache the database connection
let cachedDb = null;
let cachedClient = null;

// Helper function to get database connection
async function getDatabase() {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    cachedClient = client;
    cachedDb = client.db("scalebridge");
    console.log("Connected to MongoDB");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// API Routes
app.get("/", (req, res) => {
  res.json({ message: "ScaleBridge API is running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "ScaleBridge API is running" });
});

// POST endpoint to save contact form data
app.post("/api/contacts", async (req, res) => {
  try {
    console.log("Received POST request to /api/contacts");
    console.log("Request body:", req.body);

    const { name, company, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required fields",
      });
    }

    // Get database connection
    console.log("Connecting to database...");
    const db = await getDatabase();
    const contactsCollection = db.collection("contacts");

    // Create contact document
    const contact = {
      name,
      company: company || "",
      email,
      phone,
      message: message || "",
      createdAt: new Date(),
      status: "new",
    };

    console.log("Inserting contact:", contact);
    // Insert into MongoDB
    const result = await contactsCollection.insertOne(contact);
    console.log("Insert result:", result);

    res.status(201).json({
      success: true,
      message: "Contact information saved successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save contact information",
      error: error.message,
    });
  }
});

// GET endpoint to retrieve all contacts (optional - for admin use)
app.get("/api/contacts", async (req, res) => {
  try {
    const db = await getDatabase();
    const contactsCollection = db.collection("contacts");

    const contacts = await contactsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});

// POST endpoint for admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    console.log("Received POST request to /api/admin/login");
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const db = await getDatabase();
    const adminsCollection = db.collection("admins");

    // Check if admin exists
    const admin = await adminsCollection.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      admin: {
        username: admin.username,
        name: admin.name || username,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
