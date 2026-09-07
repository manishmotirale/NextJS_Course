// app/Componets/contact-form.jsx

"use client";

import Form from "next/form";

const ContactForm = ({ action }) => {
  return (
    <Form action={action} className="border rounded-lg shadow-md p-6 bg-white">
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        className="border w-full p-3 rounded-md mb-4 outline-none"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        className="border w-full p-3 rounded-md mb-4 outline-none"
        required
      />

      <textarea
        name="message"
        placeholder="Enter your message"
        rows="5"
        className="border w-full p-3 rounded-md mb-4 outline-none"
        required
      />

      <button className="bg-black text-white px-5 py-2 rounded-md hover:opacity-90 transition">
        Submit
      </button>
    </Form>
  );
};

export default ContactForm;
