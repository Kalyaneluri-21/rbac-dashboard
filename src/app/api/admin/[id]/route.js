import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middleware/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req, context) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "superadmin") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;
    const data = await req.json();

    if ("password" in data) {
      if (data.password.trim() === "") {
        delete data.password;
      } else {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
    }

    const updatedAdmin = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    }).select("-password");

    return Response.json({
      message: "Admin updated",
      admin: updatedAdmin,
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "superadmin") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;

    const deletedAdmin = await User.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return Response.json({ message: "Admin not found" }, { status: 404 });
    }

    return Response.json({
      message: "Admin deleted",
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
