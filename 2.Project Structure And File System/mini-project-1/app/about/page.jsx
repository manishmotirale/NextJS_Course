import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          Learn More About Our Story and Mission
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Our Story */}
        <div className="prose prose-lg mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4">
              We started our journey with a simple idea: to create a platform
              that empowers individuals to share their stories and connect with
              others. Our mission is to foster a community where everyone can
              express themselves freely and authentically.
            </p>
            <p className="text-gray-700 mb-4">
              Over the years, we have grown into a vibrant community of
              storytellers, artists, and creators. We believe that everyone has
              a unique story to tell, and we are committed to providing a safe
              and supportive space for those stories to be shared.
            </p>
          </div>
        </div>

        {/* Our Vision */}
        <div className="prose prose-lg mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 mb-4">
              We envision a world where everyone has the opportunity to share
              their stories and connect with others. We believe that
              storytelling has the power to inspire, educate, and bring people
              together.
            </p>
            <p className="text-gray-700 mb-4">
              We are committed to fostering a culture of inclusivity, diversity,
              and respect. By sharing our stories, we can create a more
              empathetic and understanding world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
