import React from "react";

export const metadata = {
  title: {
    default: "Dashboard Layout",
    template: "%s | Dashboard Layout",
  },
  description: "This is the dashboard layout of the app",
};

export default function DashboardLayout({ children }) {
  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold">Dashboard Layout</h1>

      <p className="mt-4 text-lg text-gray-600">
        This is the dashboard layout. Here you can find all the dashboard
        related pages.
      </p>

      <div className="mt-8">{children}</div>
    </section>
  );
}
