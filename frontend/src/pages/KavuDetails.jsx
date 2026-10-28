import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function KavuDetails() {
  const { id } = useParams();

  const [kavu, setKavu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchKavu() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/kavus/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load Kavu details."
          );
        }

        setKavu(result.data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchKavu();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading Kavu details...
      </div>
    );
  }

  if (error || !kavu) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <p className="text-red-500">
          {error || "Kavu not found."}
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-red-400 hover:text-red-300"
        >
          ← Back to map
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/"
          className="text-sm text-red-400 hover:text-red-300"
        >
          ← Back to TheyyamGo
        </Link>

        <header className="mt-8 border-b border-red-900 pb-6">
          <p className="text-sm uppercase tracking-widest text-red-500">
            Theyyam Location
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            {kavu.name}
          </h1>

          <p className="mt-3 text-gray-400">
            📍 {kavu.district}, Kerala
          </p>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${kavu.location.latitude},${kavu.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-xl bg-red-700 px-5 py-3 font-semibold transition hover:bg-red-800"
          >
            Get Directions
          </a>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Festival Events
          </h2>

          {kavu.events?.length > 0 ? (
            <div className="mt-5 space-y-5">
              {kavu.events.map((event, index) => (
                <article
                  key={event._id || `${event.festivalName}-${index}`}
                  className="rounded-2xl border border-red-900 bg-red-950/20 p-5"
                >
                  <h3 className="text-xl font-semibold text-red-400">
                    {event.festivalName}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300">
                    📅 {formatDate(event.date)}
                  </p>

                  <h4 className="mt-5 font-semibold">
                    Theyyam Performances
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {event.theyyams?.length > 0 ? (
                      event.theyyams.map((theyyam, theyyamIndex) => (
                        <span
                          key={`${theyyam}-${theyyamIndex}`}
                          className="rounded-full border border-red-900 bg-black px-3 py-2 text-sm text-red-300"
                        >
                          {theyyam}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No performances listed.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-400">
              No festival events have been added yet.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}

export default KavuDetails;