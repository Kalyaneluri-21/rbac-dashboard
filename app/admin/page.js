"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    const res = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    let bodyData = { ...form };

    if (editId && !form.password) {
      delete bodyData.password;
    }

    const res = await fetch(editId ? `/api/user/${editId}` : "/api/user", {
      method: editId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.message);
      return;
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setEditId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
    });
    setEditId(user._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {errorMsg && (
          <p className="text-red-500 mb-4 bg-red-100 p-2 rounded">{errorMsg}</p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-medium">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* USERS TABLE */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Your Users</h2>

        <div className="overflow-hidden rounded border">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td className="text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
