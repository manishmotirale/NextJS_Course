import { createTodo } from "@/actions/action";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero / Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Next.js Todo App</h1>

            <p className="text-gray-400 mb-8">
              Learn Server Actions with Next.js App Router
            </p>

            {/* Form */}
            <form
              action={createTodo}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="text"
                name="title"
                required
                placeholder="Enter todo"
                className="flex-1 max-w-md px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 transition-colors px-6 py-3 rounded-lg font-medium"
              >
                Add Todo
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="text-gray-400 body-font">
        <div className="container px-5 py-24 mx-auto">
          {/* Heading */}
          <div className="text-center mb-20">
            <h1 className="sm:text-3xl text-2xl font-bold title-font text-white mb-4">
              Powerful Features
            </h1>

            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
              Build fast and scalable applications using Next.js Server Actions
              and Tailwind CSS.
            </p>

            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-purple-500 inline-flex"></div>
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            {/* Card 1 */}
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>

              <div className="flex-grow">
                <h2 className="text-white text-lg font-medium mb-3">
                  Fast Performance
                </h2>

                <p className="leading-relaxed text-base">
                  Server Components and optimized rendering provide blazing-fast
                  page loads.
                </p>

                <button className="mt-3 text-purple-400 inline-flex items-center">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>

                  <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>

              <div className="flex-grow">
                <h2 className="text-white text-lg font-medium mb-3">
                  Easy Development
                </h2>

                <p className="leading-relaxed text-base">
                  Build full-stack apps with less boilerplate using modern React
                  and Next.js features.
                </p>

                <button className="mt-3 text-purple-400 inline-flex items-center">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
              <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-5 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>

                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              <div className="flex-grow">
                <h2 className="text-white text-lg font-medium mb-3">
                  Scalable Architecture
                </h2>

                <p className="leading-relaxed text-base">
                  Organize your application cleanly with App Router and reusable
                  components.
                </p>

                <button className="mt-3 text-purple-400 inline-flex items-center">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center mt-16">
            <Image
              src="https://plus.unsplash.com/premium_photo-1771711528771-09b5071278e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Test Image"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
            />
          </div>

          {/* Button */}
          <button className="flex mx-auto mt-16 text-white bg-purple-500 border-0 py-3 px-8 focus:outline-none hover:bg-purple-600 rounded-lg text-lg transition-colors">
            Explore More
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="pb-10">
        <Link
          href={{
            pathname: "/about",
            query: { name: "Manish Motirale" },
          }}
          className="text-purple-400 hover:text-purple-600 px-4 py-2 rounded-lg transition-colors text-center block mx-auto"
        >
          About Us
        </Link>
      </section>
    </main>
  );
}
