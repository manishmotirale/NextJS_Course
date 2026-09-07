"use client";
import React, { useEffect } from "react";
import { useState } from "react";

const ClientPage = () => {
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.github.com/users/manishmotirale");
      const data = await res.json();
      setUserData(data);
    }
    fetchData();
  }, []);

  const origin = window.location.origin;
  return (
    <div>
      <h2>Client Componenet Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {""}
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      {userData && (
        <div>
          <h3>{userData.name}</h3>
          <p>{userData.bio}</p>
          <p>Origin: {origin}</p>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
