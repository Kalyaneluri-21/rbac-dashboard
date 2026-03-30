import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/middleware/auth";

export async function POST(req) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "user") {
      return Response.json({ message: "Only users can create tasks" }, { status: 403 });
    }

    await connectDB();

    const { title, description } = await req.json();

    const task = await Task.create({
      title,
      description,
      userId: user.id,
    });

    return Response.json({
      message: "Task created",
      task,
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

    if (user.role !== "user") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const tasks = await Task.find({ userId: user.id });

    return Response.json({ tasks });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}