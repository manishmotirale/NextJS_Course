"use client";
import { getUsers } from "@/app/lib/user";
import React, { useCallback, useEffect, useState } from "react";
import { deleteUser, addUser } from "@/actions";

interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !avatar) {
      setError("Name and Avatar are required");
      return;
    }

    setLoading(true);
    try {
      await addUser(name, avatar);
      setName("");
      setAvatar("");
      await loadUsers();
      setError("");
    } catch (err) {
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);

    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar} alt={user.name} />
            <span>{user.name}</span>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Avatar URL"
        />
        <button type="submit" disabled={loading}>
          Add User
        </button>
      </form>
      <button onClick={loadUsers} disabled={loading}>
        Load Users
      </button>
    </div>
  );
}
