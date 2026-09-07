// app/dashboard/page.jsx

import { dbConnet } from "@/lib/db";
import Contact from "@/lib/models/Contact";
import React from "react";
import StatusButton from "../Componets/status-btn";

const DashBoard = async () => {
  await dbConnet();

  const contacts = await Contact.find();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Contact Messages
      </h1>

      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="border rounded-lg shadow-sm p-5 mb-5 bg-white"
        >
          <h3 className="text-xl font-semibold">
            {contact.name}
          </h3>

          <p className="text-gray-600">
            {contact.email}
          </p>

          <p className="mt-3">
            {contact.message}
          </p>

          {contact.status === "resolved" ? (
            <p className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md w-fit">
              {contact.status}
            </p>
          ) : (
            <StatusButton id={contact._id.toString()} />
          )}
        </div>
      ))}
    </div>
  );
};

export default DashBoard;