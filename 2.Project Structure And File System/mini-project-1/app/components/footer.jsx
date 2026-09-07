import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-500 border-t border-gray-200 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-">
          &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Designed and built with ❤️ by Manish and the Next.js Team.
        </p>
      </div>
    </div>
  );
};

export default Footer;
