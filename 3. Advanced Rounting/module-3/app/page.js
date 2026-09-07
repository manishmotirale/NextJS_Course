import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Hero Image */}
      <Image
        src="/hero.svg" // make sure this exists in /public
        alt="Hero Image"
        width={400}
        height={400}
        priority
      />

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mt-6 text-center">
        Welcome to My Website 🚀
      </h1>

      {/* Description */}
      <p className="text-gray-600 mt-4 text-center max-w-lg">
        Build modern web applications using Next.js, Tailwind CSS, and React.
      </p>

      {/* Button */}
      <button className="mt-8 px-6 py-3 bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg font-semibold shadow-md">
        Get Started
      </button>
    </div>
  );
}
