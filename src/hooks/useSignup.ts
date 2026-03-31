import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { userSignUp } from "../redux/userSlice";

export const useSignup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [formErrors, setFormErrors] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim()) return setFormErrors("Name is required");
    if (name.length < 3)
      return setFormErrors("Name must be at least 3 characters");
    if (!emailRegex.test(email)) return setFormErrors("Invalid email address");
    if (!validatePassword(password))
      return setFormErrors(
        "Password must be at least 6 characters, include uppercase, lowercase and a number",
      );
    if (password !== confirmPassword)
      return setFormErrors("Passwords do not match");

    dispatch(
      userSignUp({
        name,
        email,
        password,
        role,
      }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/otp-verify", {
          state: { email },
        });
      }
    });
  };

  return {
    formData,
    loading,
    error,
    formErrors,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit,
  };
};
