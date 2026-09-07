// app/layout.js

import "./globals.css";
import Navbar from "./Componets/navbar";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Contact App",
  description: "Simple Contact Form App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-100`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
