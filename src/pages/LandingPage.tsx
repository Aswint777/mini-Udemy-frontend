import React from "react";
import BaseNavbar from "../utility/BaseNavbar";


function LandingPage() {

  return (
    <div>
      <BaseNavbar/>
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-teal-400 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-16">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-4">Welcome !!! </h1>

            <p className="text-sm mb-6 text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex gap-4">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold">
                TRY NOW
              </button>
              <button className="border border-white px-6 py-2 rounded-full">
                SEE MORE
              </button>
            </div>
          </div>

          <div className="mt-10 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="course"
              className="w-80"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 bg-white text-black">
          <div className="p-10 border-r">
            <h2 className="text-2xl font-bold mb-4">News</h2>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="p-10">
            <h2 className="text-2xl font-bold mb-4">Blog</h2>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}

export default LandingPage;
