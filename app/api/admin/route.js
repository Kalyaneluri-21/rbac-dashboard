import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middleware/auth";

export async function POST(req) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "superadmin") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { name, email, phone, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ message: "Admin already exists" }, { status: 400 });
    }

    const admin = await User.create({
      name,
      email,
      phone,
      password,
      role: "admin",
      createdBy: user.id,
    });

    const { password: _, ...rest } = admin._doc;

    return Response.json({
      message: "Admin created",
      admin: rest,
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "superadmin") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const admins = await User.find({ role: "admin" }).select("-password");

    return Response.json({
      admins,
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}