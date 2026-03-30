"use client";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTasks = async () => {
    const res = await fetch("/api/task", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTasks(data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch(
      editId ? `/api/task/${editId}` : "/api/task",
      {
        method: editId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.message);
      return;
    }

    setForm({
      title: "",
      description: "",
      status: "pending",
    });

    setEditId(null);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/task/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setEditId(task._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Tasks Dashboard
        </h1>

        {errorMsg && (
          <p className="text-red-500 mb-4 bg-red-100 p-2 rounded">
            {errorMsg}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            {editId ? "Update Task" : "Add Task"}
          </button>
        </form>

        {/* TASK LIST */}
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-gray-50 border rounded p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-gray-600">{t.description}</p>

                <span
                  className={`text-sm px-2 py-1 rounded ${
                    t.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}