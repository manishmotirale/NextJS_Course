"use client";

import { useState } from "react";
import * as userActions from "@/actions/user.action";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [updateForm, setUpdateForm] = useState({
    id: "",
    name: "",
    email: "",
  });

  // Create User
  const handleCreate = async () => {
    await userActions.createUser(form);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    alert("User Created");
  };

  // Get All Users
  const handleGetUsers = async () => {
    const data = await userActions.getUsers();
    setUsers(data);
  };

  // Get User By Id
  const handleGetUserById = async () => {
    const data = await userActions.getUsersById(Number(userId));
    setUsers(data);
  };

  // Update User
  const handleUpdate = async () => {
    await userActions.updateUsers(Number(updateForm.id), {
      name: updateForm.name,
      email: updateForm.email,
    });

    alert("User Updated");
  };

  // Delete User
  const handleDelete = async (id: number) => {
    await userActions.deleteUser(id);

    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">User CRUD App</h1>

      {/* Create User */}
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-3">Create User</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 mr-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mr-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mr-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2"
        >
          Create
        </button>
      </div>

      {/* Get All Users */}
      <div>
        <button
          onClick={handleGetUsers}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Get All Users
        </button>
      </div>

      {/* Get User By ID */}
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-3">Get User By ID</h2>

        <input
          type="number"
          placeholder="User ID"
          className="border p-2 mr-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button
          onClick={handleGetUserById}
          className="bg-purple-500 text-white px-4 py-2"
        >
          Search
        </button>
      </div>

      {/* Update User */}
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-3">Update User</h2>

        <input
          type="number"
          placeholder="User ID"
          className="border p-2 mr-2"
          value={updateForm.id}
          onChange={(e) =>
            setUpdateForm({
              ...updateForm,
              id: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="New Name"
          className="border p-2 mr-2"
          value={updateForm.name}
          onChange={(e) =>
            setUpdateForm({
              ...updateForm,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="New Email"
          className="border p-2 mr-2"
          value={updateForm.email}
          onChange={(e) =>
            setUpdateForm({
              ...updateForm,
              email: e.target.value,
            })
          }
        />

        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white px-4 py-2"
        >
          Update
        </button>
      </div>

      {/* Users List */}
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-3">Users</h2>

        {users.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="border p-3 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
