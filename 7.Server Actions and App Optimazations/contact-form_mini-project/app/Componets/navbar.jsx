// app/Componets/navbar.jsx

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Contact App</h1>

      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Home
        </Link>

        <Link
          href="/dashboard"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
