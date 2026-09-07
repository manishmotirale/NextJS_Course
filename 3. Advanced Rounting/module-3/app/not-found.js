import React from "react";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <Image
        src="/not-found.svg"
        alt="Page Not Found"
        width={350}
        height={350}
        priority
      />

      <h1 className="text-2xl md:text-3xl font-bold mt-6">
        404 - Page Not Found
      </h1>

      <p className="text-gray-500 mt-2 text-center max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg font-semibold shadow-md"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
