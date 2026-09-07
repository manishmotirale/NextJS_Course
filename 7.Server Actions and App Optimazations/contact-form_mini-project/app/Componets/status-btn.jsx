// app/Componets/status-btn.jsx

"use client";

import React from "react";
import Form from "next/form";
import { updateStatus } from "@/actions/contact";

const StatusButton = ({ id }) => {
  const action = updateStatus.bind(null, id);

  return (
    <Form action={action}>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded-md transition">
        Mark Resolved
      </button>
    </Form>
  );
};

export default StatusButton;
