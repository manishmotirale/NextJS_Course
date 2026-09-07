const services = [
  {
    title: "Web Development",
    desc: "Modern responsive websites using Next.js.",
  },
  {
    title: "UI/UX Design",
    desc: "Clean and user-friendly interface designs.",
  },
  {
    title: "Frontend Development",
    desc: "Fast and scalable React applications.",
  },
  {
    title: "Performance Optimization",
    desc: "Improve website speed and SEO.",
  },
];

const Services = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-red-500 font-semibold">Our Services</p>

          <h1 className="text-5xl font-bold text-gray-900 mt-4">
            What We Offer
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center text-2xl mb-6">
                🚀
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h2>

              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
