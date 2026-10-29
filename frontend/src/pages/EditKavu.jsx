import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_URL from "../config";

const districts = [
  "Kannur",
  "Kasaragod",
  "Kozhikode",
  "Wayanad",
  "Malappuram",
];

function EditKavu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    district: "Kannur",
    latitude: "",
    longitude: "",
    events: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the existing Kavu details.
  useEffect(() => {
    async function loadKavu() {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load Kavu.");
        }

        // Support either a direct Kavu response or a wrapped response.
        const kavu = result.kavu ?? result.data ?? result;

        setForm({
          name: kavu.name ?? "",
          district: kavu.district ?? "Kannur",
          latitude: kavu.location?.latitude ?? "",
          longitude: kavu.location?.longitude ?? "",
          events: (kavu.events ?? []).map((event) => ({
            festivalName: event.festivalName ?? "",
            date: event.date
              ? new Date(event.date).toISOString().slice(0, 10)
              : "",
            theyyams: Array.isArray(event.theyyams)
              ? [...event.theyyams]
              : [],
          })),
        });
      } catch (err) {
        setError(err.message || "Unable to load Kavu.");
      } finally {
        setLoading(false);
      }
    }

    loadKavu();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEventChange(index, field, value) {
    setForm((previous) => ({
      ...previous,
      events: previous.events.map((event, eventIndex) =>
        eventIndex === index
          ? { ...event, [field]: value }
          : event
      ),
    }));
  }

  function handleTheyyamChange(eventIndex, theyyamIndex, value) {
    setForm((previous) => ({
      ...previous,
      events: previous.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: event.theyyams.map((name, index2) =>
                index2 === theyyamIndex ? value : name
              ),
            }
          : event
      ),
    }));
  }

  function addEvent() {
    setForm((previous) => ({
      ...previous,
      events: [
        ...previous.events,
        {
          festivalName: "",
          date: "",
          theyyams: [""],
        },
      ],
    }));
  }

  function removeEvent(index) {
    setForm((previous) => ({
      ...previous,
      events: previous.events.filter(
        (_, eventIndex) => eventIndex !== index
      ),
    }));
  }

  function addTheyyam(eventIndex) {
    setForm((previous) => ({
      ...previous,
      events: previous.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: [...event.theyyams, ""],
            }
          : event
      ),
    }));
  }

  function removeTheyyam(eventIndex, theyyamIndex) {
    setForm((previous) => ({
      ...previous,
      events: previous.events.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: event.theyyams.filter(
                (_, index2) => index2 !== theyyamIndex
              ),
            }
          : event
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Your admin session is missing. Please log in again.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter a Kavu name.");
      return;
    }

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (
      form.latitude === "" ||
      form.longitude === "" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }

    if (
      form.events.some(
        (event) =>
          !event.festivalName.trim() ||
          !event.date ||
          event.theyyams.some((name) => !name.trim())
      )
    ) {
      setError(
        "Every festival needs a name and date. Remove empty Theyyam fields or fill them in."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      district: form.district,
      location: {
        latitude,
        longitude,
      },
      events: form.events.map((event) => ({
        festivalName: event.festivalName.trim(),
        date: event.date,
        theyyams: event.theyyams.map((name) => name.trim()),
      })),
    };

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update Kavu.");
      }

      setSuccess("Kavu updated successfully!");

      setTimeout(() => {
        navigate("/admin/kavus");
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to update Kavu.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading Kavu details...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            TheyyamGo Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Edit Kavu
          </h1>

          <p className="mt-2 text-gray-400">
            Update the Kavu, festival, and Theyyam information.
          </p>

          <Link
            to="/admin/kavus"
            className="mt-4 inline-block text-red-400 hover:text-red-300"
          >
            ← Back to Manage Kavus
          </Link>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-400"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-900 bg-green-950/20 p-4 text-green-400"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-red-900 bg-red-950/10 p-5 md:p-8"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Kavu Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              District
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-red-600"
            >
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                min="-90"
                max="90"
                step="any"
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                min="-180"
                max="180"
                step="any"
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Festivals and Theyyams</h2>

              <button
                type="button"
                onClick={addEvent}
                className="rounded-lg bg-red-700 px-4 py-2 font-semibold hover:bg-red-800"
              >
                + Add Festival
              </button>
            </div>

            {form.events.map((event, eventIndex) => (
              <div
                key={eventIndex}
                className="space-y-4 rounded-xl border border-gray-800 bg-black/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">
                    Festival {eventIndex + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeEvent(eventIndex)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Festival
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Festival Name
                  </label>
                  <input
                    value={event.festivalName}
                    onChange={(e) =>
                      handleEventChange(
                        eventIndex,
                        "festivalName",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Festival Date
                  </label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) =>
                      handleEventChange(
                        eventIndex,
                        "date",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none focus:border-red-600"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300">
                    Theyyams
                  </h4>

                  {event.theyyams.map((theyyam, theyyamIndex) => (
                    <div
                      key={theyyamIndex}
                      className="flex items-center gap-2"
                    >
                      <input
                        value={theyyam}
                        onChange={(e) =>
                          handleTheyyamChange(
                            eventIndex,
                            theyyamIndex,
                            e.target.value
                          )
                        }
                        required
                        placeholder={`Theyyam ${theyyamIndex + 1}`}
                        className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 outline-none focus:border-red-600"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeTheyyam(eventIndex, theyyamIndex)
                        }
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addTheyyam(eventIndex)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    + Add Theyyam
                  </button>
                </div>
              </div>
            ))}

            {form.events.length === 0 && (
              <p className="rounded-lg border border-dashed border-gray-700 p-5 text-center text-gray-400">
                No festivals added. Click “Add Festival” to create one.
              </p>
            )}
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-red-700 px-5 py-3 font-bold transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default EditKavu;