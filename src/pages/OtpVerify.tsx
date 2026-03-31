import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpVerify() {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <p>Invalid access. Please signup again.</p>;
  }

  const [formData, setFormData] = useState({
    email,
    otp: "",
  });

  let navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/otpVerifyPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className=" max-w-md bg-white p-8 rounded-2xl ">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Enter Your OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="otp"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerify;
