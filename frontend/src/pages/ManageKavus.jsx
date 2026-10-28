import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/kavus";

function ManageKavus() {
  const [kavus, setKavus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
const [selectedDistrict, setSelectedDistrict] = useState("All");

  const fetchKavus = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load Kavus.");
      }

      // Supports APIs returning either an array or { kavus: [...] }.
      const data = Array.isArray(result)
        ? result
        : result.kavus ?? result.data;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from the server.");
      }

      setKavus(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKavus();
  }, [fetchKavus]);

  const filteredKavus = kavus.filter((kavu) => {
  const matchesName = kavu.name
    .toLowerCase()
    .includes(search.trim().toLowerCase());

  const matchesDistrict =
    selectedDistrict === "All" ||
    kavu.district === selectedDistrict;

  return matchesName && matchesDistrict;
});

  async function handleDelete(kavu) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${kavu.name}" and all its events?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Your admin session is missing. Please log in again.");
      return;
    }

    setDeletingId(kavu._id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${kavu._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete Kavu.");
      }

      setKavus((previous) =>
        previous.filter((item) => item._id !== kavu._id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete Kavu.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
              TheyyamGo
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Manage Kavus
            </h1>

            <p className="mt-2 text-gray-400">
              View and manage your Kavu records.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin"
              className="rounded-xl border border-red-900 px-4 py-2 text-red-400 hover:bg-red-950"
            >
              Admin Dashboard
            </Link>

            <Link
              to="/"
              className="rounded-xl bg-red-700 px-4 py-2 font-semibold hover:bg-red-800"
            >
              View Map
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-red-900 bg-red-950/10 p-5 md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              Matching Kavus ({filteredKavus.length})
            </h2>

            <button
              type="button"
              onClick={fetchKavus}
              disabled={loading}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:border-red-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
          <div className="mb-5 grid gap-4 md:grid-cols-2">
  <input
    type="text"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder="Search Kavu by name..."
    className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-red-600"
  />

  <select
    value={selectedDistrict}
    onChange={(event) => setSelectedDistrict(event.target.value)}
    className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-red-600"
  >
    <option value="All">All districts</option>
    <option value="Kannur">Kannur</option>
    <option value="Kasaragod">Kasaragod</option>
    <option value="Kozhikode">Kozhikode</option>
    <option value="Wayanad">Wayanad</option>
    <option value="Malappuram">Malappuram</option>
  </select>
</div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-400"
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-gray-400">
              Loading Kavus...
            </p>
          ) : filteredKavus.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
  No matching Kavus found. Try another name or district.
</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="px-4 py-3">Kavu Name</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Events</th>
                    <th className="px-4 py-3">Theyyams</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredKavus.map((kavu) => {
                    const events = Array.isArray(kavu.events)
                      ? kavu.events
                      : [];

                    const theyyamCount = events.reduce(
                      (total, event) =>
                        total +
                        (Array.isArray(event.theyyams)
                          ? event.theyyams.length
                          : 0),
                      0
                    );

                    return (
                      <tr
                        key={kavu._id}
                        className="border-b border-gray-900 transition hover:bg-red-950/10"
                      >
                        <td className="px-4 py-4 font-semibold">
                          {kavu.name}
                        </td>

                        <td className="px-4 py-4 text-gray-300">
                          {kavu.district}
                        </td>

                        <td className="px-4 py-4">
                          {events.length}
                        </td>

                        <td className="px-4 py-4">
                          {theyyamCount}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            <Link
                              to={`/kavu/${kavu._id}`}
                              className="text-red-400 hover:text-red-300"
                            >
                              View
                            </Link>
                            <Link
  to={`/admin/kavus/${kavu._id}/edit`}
  className="text-yellow-400 hover:text-yellow-300"
>
  Edit
</Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(kavu)}
                              disabled={deletingId === kavu._id}
                              className="text-red-500 hover:text-red-300 disabled:opacity-50"
                            >
                              {deletingId === kavu._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ManageKavus;