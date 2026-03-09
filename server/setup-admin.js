const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://rishabhbr18_db_user:PuzYMJ38Nn4Pyf2u@cluster0.nzo3fwp.mongodb.net/scalebridge?retryWrites=true&w=majority";

async function setupAdmin() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("scalebridge");
    const adminsCollection = db.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      username: "scalebridge",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default admin user
    const admin = {
      username: "scalebridge",
      password: "31102003",
      name: "ScaleBridge Admin",
      createdAt: new Date(),
      role: "admin",
    };

    const result = await adminsCollection.insertOne(admin);
    console.log("Admin user created successfully:", result.insertedId);
  } catch (error) {
    console.error("Error setting up admin:", error);
  } finally {
    await client.close();
  }
}

setupAdmin();
