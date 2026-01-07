import { MONGODB_URI } from "@/config/config";
import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function _db() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = MONGODB_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
      );
    }
    
    cached.promise = mongoose.connect(mongoUri, { bufferCommands: false }).then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default _db;
