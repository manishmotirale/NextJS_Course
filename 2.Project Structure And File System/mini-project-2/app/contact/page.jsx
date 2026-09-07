const Contact = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-red-500 font-semibold">Contact Us</p>

          <h1 className="text-5xl font-bold text-gray-900 mt-4">
            Let's Work Together
          </h1>
        </div>

        <form className="bg-gray-50 p-10 rounded-3xl shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="p-4 rounded-xl border outline-none focus:border-red-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="p-4 rounded-xl border outline-none focus:border-red-500"
            />
          </div>

          <textarea
            rows="6"
            placeholder="Your Message"
            className="w-full mt-6 p-4 rounded-xl border outline-none focus:border-red-500"
          ></textarea>

          <button className="mt-6 bg-red-500 hover:bg-red-600 transition text-white px-8 py-3 rounded-full">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
