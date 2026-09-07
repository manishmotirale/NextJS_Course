"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SiderBar = () => {
  const pathname = usePathname();
  const navItem = [
    { name: "DashBoard", href: "/shop/dashboard" },
    { name: "Orders", href: "/shop/orders" },
    { name: "Products", href: "/shop/products" },
    { name: "Settings", href: "/shop/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-whitet p-5">
      <h2 className="text-xl font-bold mb-6 ">Shop Panel</h2>

      <nav className="flex flex-col gap-2">
        {navItem.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.name}
              className={`p-2 rounded-md transition ${isActive ? "bg-white text-black font-semibold" : "hover:bg-gray-500"}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
