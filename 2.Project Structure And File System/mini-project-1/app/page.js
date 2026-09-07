import Image from "next/image";
import { Heart, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-center mt-10">
          Welcome to My Website
        </h1>
        <p className="text-center mt-4 text-gray-600">
          This is a simple, clean website built with Next.js and Tailwind CSS.
          It serves as a starting point for your projects, allowing you to
          quickly create a beautiful and responsive website. Explore the
          features and customize it to your needs!
        </p>

        <div className="space-x-4 mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 font-semibold">
            Get Started
          </button>

          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 font-semibold">
            Learn More
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold mb-2">Fast</h3>
          <p className="text-gray-600 italic">
            Built with Modern tech for Optimal Performance
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Heart className="text-green-500" />
          </div>

          <h3 className="text-xl font-bold mb-2">Reliable</h3>
          <p className="text-gray-600 italic">
            Built with Modern tech for Optimal Performance
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-red-500" />
          </div>

          <h3 className="text-xl font-bold mb-2">Responsive</h3>
          <p className="text-gray-600 italic">
            Built with Modern tech for Optimal Performance
          </p>
        </div>
        
      </div>
    </div>
  );
}
