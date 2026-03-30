import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/middleware/auth";

export async function PATCH(req, context) {
  try {
    const { user, error } = verifyToken(req);
    if (error) {
      return Response.json({ message: error }, { status: 401 });
    }

    if (user.role !== "user") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;
    const data = await req.json();

    const task = await Task.findById(id);

    if (!task || task.userId.toString() !== user.id) {
      return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      data,
      { returnDocument: "after" }
    );

    return Response.json({
      message: "Task updated",
      task: updatedTask,
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

    if (user.role !== "user") {
      return Response.json({ message: "Access denied" }, { status: 403 });
    }

    await connectDB();

    const { id } = await context.params;

    const task = await Task.findById(id);

    if (!task || task.userId.toString() !== user.id) {
      return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);

    return Response.json({
      message: "Task deleted",
    });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}