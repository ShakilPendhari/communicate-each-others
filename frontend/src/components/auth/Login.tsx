import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { endpoints } from "../../constants/endpoints";

export default function Login({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(endpoints.auth.login, form);
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <span onClick={onSwitch} className="text-indigo-400 cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}