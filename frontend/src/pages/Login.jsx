import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
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
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form
      );

      // Save token and name, set flag for dashboard toast
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("name", res.data.data.name);
      localStorage.setItem("showWelcomeToast", "true");

      // Keep loading for 1-2 seconds, then redirect
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");

      // Show error toast for 3-4 seconds
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
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

          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-blue-600 text-sm">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-dashed border-white"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium">
            Create one
          </a>
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
