import { useState } from "react";

const API_URL = "http://localhost:5000/api/event-submissions";

const initialForm = {
  kavuName: "",
  district: "",
  festivalName: "",
  date: "",
  theyyams: "",
  locationLink: "",
  submitterName: "",
  contact: "",
};

function Navbar() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function closeForm() {
    if (loading) return;

    setShowForm(false);
    setMessage("");
    setMessageType("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          theyyams: formData.theyyams
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit the event."
        );
      }

      setMessage(
        "Event submitted successfully! It will appear on the map only after verification."
      );

      setMessageType("success");
      setFormData(initialForm);
    } catch (error) {
      console.error("Event submission error:", error);

      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check whether the backend is running."
          : error.message || "Something went wrong. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-red-900 bg-black px-5 md:px-10">
        <div className="text-2xl font-bold text-white">
          Theyyam<span className="text-red-600">Go</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#" className="text-red-500">
            Map
          </a>

          <a href="#" className="text-gray-300 hover:text-red-500">
            Theyyam Info
          </a>

          <a href="#" className="text-gray-300 hover:text-red-500">
            About
          </a>
        </nav>

        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setMessage("");
            setMessageType("");
          }}
          className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
        >
          Submit Event
        </button>
      </header>

      {showForm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="relative z-[10000] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-red-900 bg-zinc-950 p-6 shadow-xl">
            <button
              type="button"
              onClick={closeForm}
              disabled={loading}
              aria-label="Close form"
              className="absolute right-4 top-3 text-2xl text-gray-400 hover:text-white"
            >
              &times;
            </button>

            <h2 className="mb-2 pr-8 text-2xl font-bold text-white">
              Submit a Theyyam Event
            </h2>

            <p className="mb-6 text-sm text-gray-400">
              Share event details with us. Every submission is
              verified before publication.
            </p>

            {message && (
              <div
                role="alert"
                className={`mb-4 rounded-lg border p-3 text-sm ${
                  messageType === "success"
                    ? "border-green-700 bg-green-950 text-green-300"
                    : "border-red-700 bg-red-950 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Kavu / Temple Name *
                </label>
                <input
                  name="kavuName"
                  value={formData.kavuName}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Enter Kavu or temple name"
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                >
                  <option value="">Select district</option>
                  {[
                    "Kannur",
                    "Kasaragod",
                    "Kozhikode",
                    "Wayanad",
                    "Malappuram",
                  ].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Festival Name *
                </label>
                <input
                  name="festivalName"
                  value={formData.festivalName}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="Enter festival name"
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Festival Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Theyyam Names *
                </label>
                <textarea
                  name="theyyams"
                  value={formData.theyyams}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  rows={3}
                  placeholder="Gulikan, Muchilottu Bhagavathi"
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple names with commas.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  name="locationLink"
                  value={formData.locationLink}
                  onChange={handleChange}
                  maxLength={1000}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Your Name (Optional)
                </label>
                <input
                  name="submitterName"
                  value={formData.submitterName}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">
                  Contact Information (Optional)
                </label>
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  maxLength={200}
                  placeholder="Email or phone number"
                  className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-red-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={loading}
                  className="w-1/2 rounded-lg border border-gray-700 px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;