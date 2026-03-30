import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middleware/auth";

export async function POST(req) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { name, email, phone, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      role: "user",
      createdBy: user.id,
    });

    const { password: _, ...rest } = newUser._doc;

    return Response.json({
      message: "User created",
      user: rest,
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

    await connectDB();

    let users;

    if (user.role === "superadmin") {
      users = await User.find({ role: "user" }).select("-password");
    } else if (user.role === "admin") {
      users = await User.find({
        role: "user",
        createdBy: user.id,
      }).select("-password");
    } else {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    return Response.json({ users });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}