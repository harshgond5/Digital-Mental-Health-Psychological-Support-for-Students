import React from "react";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 min-h-screen pt-32 px-4 pb-16">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Contact Us
        </h1>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Get in Touch
          </h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            ></textarea>
            <button
              type="submit"
              className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center text-gray-700">
            Our Team
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* Akhilesh */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-56 text-center hover:shadow-2xl transition">
              <img
                src="https://source.unsplash.com/150x150/?person,man"
                alt="Akhilesh"
                className="rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-bold text-gray-800">Akhilesh</h3>
              <p className="text-gray-600 text-sm">Co-Founder & Developer</p>
            </div>

            {/* Grish */}
            <div className="bg-white shadow-xl rounded-2xl p-6 w-56 text-center hover:shadow-2xl transition">
              <img
                src="https://source.unsplash.com/150x150/?person,boy"
                alt="Grish"
                className="rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-bold text-gray-800">Harsh</h3>
              <p className="text-gray-600 text-sm">Co-Founder & Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
