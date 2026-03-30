import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middleware/auth";

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

    const existing = await User.findOne({ role: "superadmin" });

    if (existing) {
      return Response.json({ message: "Super Admin already exists" });
    }

    const newUser = await User.create({
      name: "Super Admin",
      email: "superadmin@gmail.com",
      phone: "9999999999",
      password: "123456",
      role: "superadmin",
    });

    const { password: _, ...rest } = newUser._doc;

    return Response.json({
      message: "Super Admin created",
      user: rest,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
