import React from "react";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-8">
          We'd love to hear from you. Send us a message and we'll get back to
          you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Send Me Message
          </h2>
          <form className="space-y-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Email"
            />
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Message"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Contact Information
          </h2>
          <p className="text-gray-700 mb-4">
            You can also reach us through the following contact information:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>
              <strong>Email:</strong>
              <a
                href="mailto:info@company.com"
                className="text-blue-500 hover:text-blue-700"
              >
                info@company.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>
              <span className="text-gray-700">+1 (123) 456-7890</span>
            </li>
          </ul>

          <p className="text-gray-700 mt-4">
            We look forward to hearing from you and will do our best to respond
            promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
