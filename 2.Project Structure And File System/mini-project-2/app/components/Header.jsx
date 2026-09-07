"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-bold text-gray-900"
        >
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
            M
          </div>

          <span>ManishDev</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link href="/" className="hover:text-red-500 transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-red-500 transition">
            About
          </Link>

          <Link href="/services" className="hover:text-red-500 transition">
            Services
          </Link>

          <Link href="/contact" className="hover:text-red-500 transition">
            Contact
          </Link>

          <Link href="/user" className="hover:text-red-500 transition">
            Users
          </Link>
        </nav>

        {/* Button */}
        <button className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-full shadow-md">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
