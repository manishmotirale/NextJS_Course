import React from "react";

export const metadata = {
  title: "Learn a About Page",
  description: "This is the about page of the app",
};

const AboutPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">About Page</h1>
      <p className="mt-4 text-lg">
        This is the about page of the app. Here you can find more information
        about the app and its features.
      </p>
    </div>
  );
};

export default AboutPage;
