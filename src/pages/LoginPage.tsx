import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import BaseNavbar from "../utility/BaseNavbar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState<string | null>(null);

  const { loading, error, user } = useAppSelector((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    dispatch(
      userLogin({
        email: formData.email,
        password: formData.password,
      }),
    );
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div>
      <BaseNavbar />

      <div className="min-h-screen flex items-center justify-center bg-blue-300">
        <div className=" max-w-md bg-white p-8 rounded-2xl ">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login Now........
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <p className="text-red-600 text-sm text-center">{formError}</p>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/sign-up")}
            >
              SignUp
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
