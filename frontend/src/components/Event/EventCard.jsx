import { Link } from "react-router-dom";

function EventCard({ kavu, onClose }) {
  if (!kavu) {
    return null;
  }

  // Format the event date
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="absolute bottom-5 left-5 z-[1000] max-h-[85%] w-[350px] max-w-[calc(100%-40px)] overflow-y-auto rounded-2xl border border-red-900 bg-black p-5 shadow-2xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-red-500">
            Theyyam Location
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            {kavu.name}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            📍 {kavu.district}, Kerala
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close event details"
          className="rounded-full px-2 py-1 text-gray-500 transition hover:bg-red-950 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* Events */}
      <div className="mt-5">
        <h3 className="font-semibold text-white">
          Festival Events
        </h3>

        {kavu.events && kavu.events.length > 0 ? (
          <div className="mt-3 space-y-4">
            {kavu.events.map((event, index) => (
              <div
                key={event._id || `${event.festivalName}-${index}`}
                className="rounded-xl border border-red-950 bg-red-950/30 p-3"
              >
                {/* Festival name */}
                <h4 className="font-semibold text-red-400">
                  {event.festivalName}
                </h4>

                {/* Event date */}
                <p className="mt-2 text-sm text-gray-300">
                  📅 {formatDate(event.date)}
                </p>

                {/* Theyyam performances */}
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Theyyam Performances
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.theyyams && event.theyyams.length > 0 ? (
                      event.theyyams.map((theyyam, theyyamIndex) => (
                        <span
                          key={`${theyyam}-${theyyamIndex}`}
                          className="rounded-full border border-red-900 bg-black px-3 py-1 text-sm text-red-400"
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-400">
            No events are currently listed for this Kavu.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex gap-2">
        <Link
  to={`/kavu/${kavu._id}`}
  className="flex-1 rounded-xl bg-red-700 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-800"
>
  View Details
</Link>
        <button
          onClick={() => {
            const { latitude, longitude } = kavu.location;

            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
              "_blank",
              "noopener,noreferrer"
            );
          }}
          className="rounded-xl border border-gray-700 px-3 py-3 text-sm font-semibold text-gray-300 transition hover:border-red-700 hover:text-red-500"
        >
          Directions
        </button>
      </div>
    </div>
  );
}

export default EventCard;