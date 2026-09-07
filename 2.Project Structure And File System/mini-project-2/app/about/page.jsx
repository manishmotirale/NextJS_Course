const About = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-red-500 font-semibold mb-4">About Us</p>

        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Passionate About Modern Development
        </h1>

        <p className="text-lg leading-relaxed text-gray-600">
          We specialize in creating elegant and modern websites using
          cutting-edge technologies like React, Next.js, and Tailwind CSS. Our
          goal is to deliver fast, responsive, and user-friendly experiences.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-red-50 p-8 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-bold text-red-500">10+</h2>
            <p className="mt-2 text-gray-600">Projects Completed</p>
          </div>

          <div className="bg-red-50 p-8 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-bold text-red-500">5+</h2>
            <p className="mt-2 text-gray-600">Technologies Used</p>
          </div>

          <div className="bg-red-50 p-8 rounded-3xl shadow-sm">
            <h2 className="text-3xl font-bold text-red-500">100%</h2>
            <p className="mt-2 text-gray-600">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
