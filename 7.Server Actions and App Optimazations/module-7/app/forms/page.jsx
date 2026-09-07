"use client";
import React from "react";
import Form from "next/form";
import { submitUser } from "@/actions/action";
import { useRouter } from "next/navigation";

const FormPage = () => {
  const router = useRouter();

  return (
    <div className="container ">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <Form action={submitUser} className="flex flex-col gap-2.5">
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="name"
          placeholder="Enter Name"
        />
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          name="email"
          placeholder="Enter Email"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      </Form>

      <h1 className="text-2xl font-bold mt-8 mb-2">Search Form</h1>
      <Form action={"/search"} className=" flex flex-col gap-2.5">
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="query"
          placeholder="Search Post Id"
        />

        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
          type="submit"
        >
          Search
        </button>
      </Form>

      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default FormPage;
