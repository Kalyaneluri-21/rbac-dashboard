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

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (
      user.role === "admin" &&
      existingUser.createdBy.toString() !== user.id
    ) {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    if (user.role === "user") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    }).select("-password");

    return Response.json({
      message: "User updated",
      user: updatedUser,
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

    await connectDB();

    const { id } = await context.params;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (
      user.role === "admin" &&
      existingUser.createdBy.toString() !== user.id
    ) {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    if (user.role === "user") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return Response.json({
      message: "User deleted",
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
