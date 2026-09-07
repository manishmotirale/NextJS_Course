"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Orders = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 p-6 max-w-sm mx-auto">
      // The `router.push()` method is used to navigate to a new page and adds a
      new entry to the browser's history stack.
      <button
        onClick={() => router.push("/shop/products")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Push → Products
      </button>
      // The `router.replace()` method is used to navigate to a new page without
      adding a new entry to the browser's history stack.
      <button
        onClick={() => router.replace("/shop/settings")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Replace → Settings
      </button>
      // The `router.refresh()` method is used to re-fetch data and re-render
      the current page without changing the URL.
      <button
        onClick={() => router.refresh()}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Refresh Page
      </button>
      // Note: The `router.back()` and `router.forward()` methods depend on the
      browser's history stack.
      <button
        onClick={() => router.back()}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Go Back
      </button>
      <button
        onClick={() => router.forward()}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Go Forward
      </button>
    </div>
  );
};

export default Orders;
