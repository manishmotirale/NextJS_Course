"use client";
import localFont from "next/font/local";
import Link from "next/link";

const audiowideFont = localFont({
  src: "./fonts/myfont.ttf",
  display: "swap",
});

export default function AboutPage() {
  return (
    <section
      className={`bg-gray-900 text-gray-400 body-font ${audiowideFont.className}`}
    >
      <Link
        href="/forms"
        className="text-purple-400 hover:text-purple-600 px-4 py-2 rounded-lg transition-colors text-center block mx-auto mb-10"
        replace
        onNavigate={() => {
          console.log("Navigating to forms...");
        }}
      >
        Go to Forms
      </Link>

      <div className="container px-5 py-24 mx-auto">
        <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="inline-block w-8 h-8 text-gray-500 mb-8"
            viewBox="0 0 975.036 975.036"
          >
            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50z" />
          </svg>

          <p className="leading-relaxed text-lg">
            Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki
            taxidermy 90's cronut +1 kinfolk.
          </p>

          <span className="inline-block h-1 w-10 rounded bg-purple-500 mt-8 mb-6"></span>

          <h2 className="text-white font-medium tracking-wider text-sm">
            HOLDEN CAULFIELD
          </h2>

          <p className="text-gray-500">Senior Product Designer</p>
        </div>
      </div>
    </section>
  );
}
