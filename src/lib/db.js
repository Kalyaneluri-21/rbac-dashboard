import mongoose from "mongoose";
import User from "@/models/User";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB Connected");

  // ✅ Auto seed
  const existing = await User.findOne({ role: "superadmin" });

  if (!existing) {
    await User.create({
      name: "Super Admin",
      email: "superadmin@gmail.com",
      phone: "9999999999",
      password: "123456", // ⚠️ hash if needed
      role: "superadmin",
    });

    console.log("Super Admin auto-created");
  }
};