"use client";
import { useEffect, useState } from "react";

export default function SuperAdmin() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
  });

  const [editId, setEditId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    const adminRes = await fetch("/api/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const adminData = await adminRes.json();
    setAdmins(adminData.admins || []);

    const userRes = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await userRes.json();
    setUsers(userData.users || []);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const url = form.role === "admin" ? "/api/admin" : "/api/user";

    let bodyData = { ...form };

    if (editId && !form.password) {
      delete bodyData.password;
    }

    const res = await fetch(editId ? `${url}/${editId}` : url, {
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
      role: "admin",
    });

    setEditId(null);
    fetchData();
  };

  const handleDelete = async (id, role) => {
    const url = role === "admin" ? "/api/admin" : "/api/user";

    await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchData();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      password: "",
      role: item.role,
    });
    setEditId(item._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Super Admin Dashboard
        </h1>

        {errorMsg && (
          <p className="text-red-500 mb-4 bg-red-100 p-2 rounded">{errorMsg}</p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-8"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-medium transition">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* ADMINS TABLE */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Admins</h2>

        <div className="overflow-hidden rounded border mb-8">
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
              {admins.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td className="text-center space-x-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(a._id, "admin")}
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

        {/* USERS TABLE */}
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Users</h2>

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
                      onClick={() => handleDelete(u._id, "user")}
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
