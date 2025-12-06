// import mongoose from "mongoose";

// let isConnected = false;

// export default async function dbConnect() {
//   if (isConnected) {
//     // Already connected
//     return;
//   }

//   if (!process.env.MONGODB_URI) {
//     throw new Error("❌ MONGODB_URI is missing in .env");
    
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI);

//     isConnected = db.connections[0].readyState === 1;

//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error);
//   }
// }

import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  // If already connected, skip
  if (isConnected) return;

  // If Mongo already has an open connection, reuse it
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in .env");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "UserApp", // change to your database
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}
