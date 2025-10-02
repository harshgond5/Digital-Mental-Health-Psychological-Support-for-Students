import React from "react";

const About = () => {
  const sections = [
    {
      title: "Our Team",
      text: "We are a group of passionate developers and thinkers who believe in building solutions that truly matter. Each member brings unique skills and creativity to deliver the best for our users.",
      img: "/images/our team.png",
    },
    {
      title: "Our Goals",
      text: "Our goal is simple: to make technology more human-centered. We aim to bridge the gap between complex systems and user-friendly solutions that inspire trust and ease of use.",
      img: "/images/our goal.png",
    },
    {
      title: "Our Mission & Focus",
      text: "We are dedicated to raising awareness about stress, mental wellness, and productivity. Many people ignore these challenges, but we take them seriously—and we’re here to help users find calm in their daily lives.",
      img: "/images/our goal.png",
    },
    {
      title: "Our Vision",
      text: "We imagine a future where technology doesn’t just solve problems but also supports well-being. Through innovation, empathy, and design, we want to create experiences that leave a positive mark on every user.",
      img: "/images/our vision.png",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-16 px-6 mt-24 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          About Us
        </h1>

        {/* Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="md:w-5/12">
              <img
                src={section.img}
                alt={section.title}
                className="rounded-lg shadow-md w-full object-cover h-64 md:h-72"
              />
            </div>

            {/* Text */}
            <div className="md:w-7/12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {section.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
