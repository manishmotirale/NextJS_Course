const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">ManishDev</h2>

            <p className="text-gray-400 leading-relaxed">
              Building modern and responsive web applications using Next.js and
              Tailwind CSS.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

            <div className="flex flex-col gap-2">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/services">Services</a>
              <a href="/contact">Contact</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition cursor-pointer">
                F
              </div>

              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition cursor-pointer">
                I
              </div>

              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition cursor-pointer">
                X
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ManishDev. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
