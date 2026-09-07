const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <p className="text-red-500 font-semibold mb-4">
            Welcome to My Portfolio
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Modern Web Experiences With Next.js
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            I create beautiful, responsive, and modern web applications using
            Next.js, React, and Tailwind CSS.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-full shadow-lg">
              Get Started
            </button>

            <button className="border border-gray-300 hover:border-red-500 hover:text-red-500 transition px-8 py-3 rounded-full">
              Learn More
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="hero"
            className="rounded-3xl shadow-2xl object-cover h-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
