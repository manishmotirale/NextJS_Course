"use client";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    });
    setTitle("");

    const data = await res.json();

    if (data.success) {
      setMessage("TODO Created: " + data.todo.title);
    } else {
      setMessage("Failed to create TODO");
    }
  };

  return (
    <div>
      <h2>Create TODO</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          placeholder="Your Todo Title"
          required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p className="bg-amber-700 text-3xl ">{message}</p>}
    </div>
  );
}
