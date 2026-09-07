// app/page.jsx

import { dbConnet } from "@/lib/db";
import Image from "next/image";
import ContactForm from "./Componets/contact-form";
import { createContact } from "@/actions/contact";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Contact Us
      </h1>

      <ContactForm action={createContact} />
    </div>
  );
}