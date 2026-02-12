import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!form.name.trim()) {
      toast.error("First name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!form.password.trim()) {
      toast.error("Password is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v2/auth/signup",
        form
      );

      // Show success toast
      toast.success(`Welcome ${res.data.data.name}`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect after 3 seconds to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Signup failed", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium">
            Login
          </a>
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
