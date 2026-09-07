import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Home",
  description:
    "Learn Next.js Middleware, Metadata, and SEO with practical examples.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 shadow-md">
        <h1 className="text-5xl font-bold text-gray-900">
          Next.js Middleware, Metadata & SEO
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          This project demonstrates how to use Middleware, dynamic Metadata, and
          SEO optimization in Next.js App Router.
        </p>

        {/* Features Section */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Middleware</h2>

            <p className="mt-3 text-gray-600">
              Protect routes, manage redirects, and process requests.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">Metadata</h2>

            <p className="mt-3 text-gray-600">
              Configure dynamic titles, descriptions, and Open Graph tags.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold">SEO</h2>

            <p className="mt-3 text-gray-600">
              Improve visibility with semantic HTML and optimized metadata.
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-14">
          <h2 className="text-3xl font-bold text-gray-900">Explore Sections</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Link
              href="/dashboard"
              className="rounded-xl border bg-gray-50 p-6 transition hover:shadow-md"
            >
              <h3 className="text-2xl font-semibold">Dashboard</h3>

              <p className="mt-3 text-gray-600">
                Access dashboard pages, settings, analytics, and protected
                routes.
              </p>
            </Link>

            <Link
              href="/about"
              className="rounded-xl border bg-gray-50 p-6 transition hover:shadow-md"
            >
              <h3 className="text-2xl font-semibold">About</h3>

              <p className="mt-3 text-gray-600">
                Learn more about this project and the concepts covered in
                Next.js.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
