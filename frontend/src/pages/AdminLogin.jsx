
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      if (!result.token) {
        throw new Error("The server did not return an authentication token.");
      }

      localStorage.setItem("adminToken", result.token);

      navigate("/admin");
    } catch (error) {
      setMessage(error.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-red-950 bg-black px-4 py-3 text-white outline-none focus:border-red-500";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-red-900 bg-red-950/10 p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
          TheyyamGo
        </p>

        <h1 className="mt-3 text-3xl font-bold">Admin Login</h1>

        <p className="mt-2 text-gray-400">
          Log in to manage Kavus and festival events.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm text-gray-300">
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          {message && (
            <p
              role="alert"
              className="rounded-xl border border-red-900 bg-red-950/30 p-3 text-sm text-red-400"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-700 px-5 py-3 font-bold transition hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-400 hover:text-red-400"
        >
          ← Back to TheyyamGo map
        </Link>
      </div>
    </main>
  );
}

export default AdminLogin;