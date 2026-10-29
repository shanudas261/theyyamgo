import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import API_URI from "../config"



const initialEvent = {
  festivalName: "",
  date: "",
  theyyams: [""],
};

function AdminDashboard() {

  const navigate = useNavigate();

function handleLogout() {
  localStorage.removeItem("adminToken");
  navigate("/admin/login", { replace: true });
}
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Kannur");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [events, setEvents] = useState([
    { ...initialEvent, theyyams: [""] },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Update one event field
  function updateEvent(eventIndex, field, value) {
    setEvents((previousEvents) =>
      previousEvents.map((event, index) =>
        index === eventIndex
          ? { ...event, [field]: value }
          : event
      )
    );
  }

  // Add another festival event
  function addEvent() {
    setEvents((previousEvents) => [
      ...previousEvents,
      { ...initialEvent, theyyams: [""] },
    ]);
  }

  // Remove a festival event
  function removeEvent(eventIndex) {
    setEvents((previousEvents) =>
      previousEvents.filter((_, index) => index !== eventIndex)
    );
  }

  // Add a Theyyam name to an event
  function addTheyyam(eventIndex) {
    setEvents((previousEvents) =>
      previousEvents.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: [...event.theyyams, ""],
            }
          : event
      )
    );
  }

  // Update a Theyyam name
  function updateTheyyam(eventIndex, theyyamIndex, value) {
    setEvents((previousEvents) =>
      previousEvents.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: event.theyyams.map((name, index) =>
                index === theyyamIndex ? value : name
              ),
            }
          : event
      )
    );
  }

  // Remove a Theyyam name
  function removeTheyyam(eventIndex, theyyamIndex) {
    setEvents((previousEvents) =>
      previousEvents.map((event, index) =>
        index === eventIndex
          ? {
              ...event,
              theyyams: event.theyyams.filter(
                (_, index) => index !== theyyamIndex
              ),
            }
          : event
      )
    );
  }

  // Submit the form
  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !name.trim() ||
      latitude.trim() === "" ||
      longitude.trim() === "" ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      setMessage("Enter a Kavu name and valid coordinates.");
      setMessageType("error");
      return;
    }

    if (events.some((event) => !event.festivalName.trim() || !event.date)) {
      setMessage("Every event needs a festival name and date.");
      setMessageType("error");
      return;
    }

    const cleanedEvents = events.map((event) => ({
      festivalName: event.festivalName.trim(),
      date: event.date,
      theyyams: event.theyyams
        .map((name) => name.trim())
        .filter(Boolean),
    }));

    const payload = {
      name: name.trim(),
      district,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      events: cleanedEvents,
    };

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

if (!token) {
  throw new Error("Please log in as an admin first.");
}

const response = await fetch(`${API_URI}/kavus`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create Kavu.");
      }

      setMessage("Kavu added successfully!");
      setMessageType("success");

      setName("");
      setDistrict("Kannur");
      setLatitude("");
      setLongitude("");
      setEvents([{ ...initialEvent, theyyams: [""] }]);
    } catch (error) {
      console.error("Error creating Kavu:", error);
      setMessage(error.message || "Unable to connect to the backend.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-red-950 bg-black px-4 py-3 text-white outline-none focus:border-red-500";

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
              TheyyamGo
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-400">
              Add Kavus, festival events, and Theyyam performances.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
  <Link
    to="/"
    className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950"
  >
    View Map
  </Link>
  <Link
  to="/admin/kavus"
  className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950"
>
  Manage Kavus
</Link>

  <button
    type="button"
    onClick={handleLogout}
    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold transition hover:bg-red-800"
  >
    Logout
  </button>
</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Kavu information */}
          <section className="rounded-2xl border border-red-900 bg-red-950/10 p-5 md:p-7">
            <h2 className="text-xl font-bold">1. Kavu Information</h2>

            <div className="mt-5">
              <label className="text-sm text-gray-300">
                Kavu Name
              </label>

              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter Kavu name"
                required
              />
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-300">
                District
              </label>

              <select
                className={inputClass}
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              >
                {[
                  "Kannur",
                  "Kasaragod",
                  "Kozhikode",
                  "Wayanad",
                  "Malappuram",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-300">
                  Latitude
                </label>

                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="e.g. 11.8745"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Longitude
                </label>

                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="e.g. 75.3704"
                  required
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Enter the actual Kavu coordinates. You can obtain them from
              Google Maps.
            </p>
          </section>

          {/* Festival events */}
          <section className="rounded-2xl border border-red-900 bg-red-950/10 p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">2. Festival Events</h2>

              <button
                type="button"
                onClick={addEvent}
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold hover:bg-red-800"
              >
                + Add Event
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {events.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="rounded-xl border border-gray-800 bg-black p-4 md:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-red-400">
                      Event {eventIndex + 1}
                    </h3>

                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEvent(eventIndex)}
                        className="text-sm text-red-500 hover:text-red-300"
                      >
                        Remove event
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-gray-300">
                      Festival Name
                    </label>

                    <input
                      className={inputClass}
                      value={event.festivalName}
                      onChange={(e) =>
                        updateEvent(
                          eventIndex,
                          "festivalName",
                          e.target.value
                        )
                      }
                      placeholder="Enter festival name"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-gray-300">
                      Festival Date
                    </label>

                    <input
                      className={inputClass}
                      type="date"
                      value={event.date}
                      onChange={(e) =>
                        updateEvent(eventIndex, "date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold">
                        Theyyam Performances
                      </h4>

                      <button
                        type="button"
                        onClick={() => addTheyyam(eventIndex)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        + Add Theyyam
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {event.theyyams.map((theyyam, theyyamIndex) => (
                        <div
                          key={theyyamIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            className={inputClass + " mt-0"}
                            value={theyyam}
                            onChange={(e) =>
                              updateTheyyam(
                                eventIndex,
                                theyyamIndex,
                                e.target.value
                              )
                            }
                            placeholder="Enter Theyyam name"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeTheyyam(eventIndex, theyyamIndex)
                            }
                            disabled={event.theyyams.length === 1}
                            className="rounded-lg border border-gray-800 px-3 py-3 text-gray-400 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Remove Theyyam"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Status message */}
          {message && (
            <p
              role="status"
              className={
                messageType === "success"
                  ? "rounded-xl border border-green-900 bg-green-950/30 p-4 text-green-400"
                  : "rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-400"
              }
            >
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-700 px-5 py-4 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving Kavu..." : "Save Kavu"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminDashboard;