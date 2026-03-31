import React from "react";
import Navbar from "../utility/Navbar";
import { Award, BookOpen, Globe, Users } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Mini Udemy
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Empowering learners and instructors to build skills that matter — in
            the simplest and most affordable way possible.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                Mini Udemy was born out of a simple idea:{" "}
                <strong>
                  Quality education should be accessible to everyone.
                </strong>
              </p>
              <p>
                We noticed that many talented instructors had valuable knowledge
                to share, but traditional platforms were either too expensive or
                too complicated. At the same time, students were struggling to
                find affordable, high-quality courses.
              </p>
              <p>
                So we created Mini Udemy — a lightweight, user-friendly learning
                platform designed for both students and instructors in India and
                beyond.
              </p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  10K+
                </div>
                <p className="text-gray-600">Happy Students</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  150+
                </div>
                <p className="text-gray-600">Courses</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">80+</div>
                <p className="text-gray-600">Expert Instructors</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">4.8</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To make skill development simple, affordable, and effective by
                connecting passionate instructors with motivated learners
                through high-quality, practical courses.
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-600" />
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and loved learning platform in India,
                where anyone can learn anything — from tech skills to soft
                skills — at their own pace.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Students Love Mini Udemy
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-12 h-12 text-blue-600" />,
              title: "Learn From Experts",
              desc: "Courses created by industry professionals and experienced instructors.",
            },
            {
              icon: <Award className="w-12 h-12 text-blue-600" />,
              title: "Practical Knowledge",
              desc: "Hands-on projects and real-world examples, not just theory.",
            },
            {
              icon: <BookOpen className="w-12 h-12 text-blue-600" />,
              title: "Affordable Pricing",
              desc: "High-quality education at a fraction of the cost of big platforms.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow hover:shadow-xl transition-all"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of students who are building their future with Mini
            Udemy
          </p>
          <button
            onClick={() => (window.location.href = "/all-courses")}
            className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
