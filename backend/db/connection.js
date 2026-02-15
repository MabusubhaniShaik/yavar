import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Fix for ECONNREFUSED on some networks with Node.js 18+
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/DDT";
const client = new MongoClient(MONGODB_URI);

let db = null;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

export async function closeDB() {
  await client.close();
  console.log("MongoDB connection closed");
}

// Collection names
export const COLLECTIONS = {
  NETFLIX: "netflix",
  HR_ANALYTICS: "hr_analytics",
  SALES: "sales",
};
