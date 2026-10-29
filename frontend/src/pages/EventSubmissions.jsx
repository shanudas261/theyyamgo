import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";
  


const SUBMISSIONS_URL = `${API_URL}/api/event-submissions`;

function EventSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("Pending");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load submissions."
        );
      }

      setSubmissions(result.submissions || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleDecision(submission, decision) {
    const action = decision === "approve" ? "approve" : "reject";

    const confirmed = window.confirm(
      decision === "approve"
        ? `Approve "${submission.festivalName}" at "${submission.kavuName}"?`
        : `Reject "${submission.festivalName}"?`
    );

    if (!confirmed) return;

    setActionId(submission._id);
    setError("");
    setNotice("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${SUBMISSIONS_URL}/${submission._id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Unable to ${action} submission.`
        );
      }

      setNotice(result.message);
      await fetchSubmissions();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionId("");
    }
  }

  const filteredSubmissions = submissions.filter(
    (submission) => submission.status === filter
  );

  const counts = {
    Pending: submissions.filter((item) => item.status === "Pending")
      .length,
    Approved: submissions.filter((item) => item.status === "Approved")
      .length,
    Rejected: submissions.filter((item) => item.status === "Rejected")
      .length,
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Event Submissions
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Review visitor-submitted Theyyam events.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-zinc-900 disabled:opacity-50"
            >
              Refresh
            </button>

            <Link
              to="/admin"
              className="rounded-lg bg-red-700 px-4 py-2 text-sm hover:bg-red-800"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Status summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl border p-5 text-left transition ${
                filter === status
                  ? "border-red-600 bg-zinc-900"
                  : "border-gray-800 bg-zinc-950 hover:border-gray-600"
              }`}
            >
              <p className="text-sm text-gray-400">{status}</p>
              <p className="mt-2 text-3xl font-bold">
                {counts[status]}
              </p>
            </button>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-200"
          >
            {error}

            {error.toLowerCase().includes("token") && (
              <p className="mt-2">
                Your session may have expired. Please log in again.
              </p>
            )}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-800 bg-green-950 p-4 text-sm text-green-200"
          >
            {notice}
          </div>
        )}

        <h2 className="mb-4 text-xl font-semibold">
          {filter} Submissions ({filteredSubmissions.length})
        </h2>

        {loading ? (
          <p className="py-10 text-center text-gray-400">
            Loading submissions...
          </p>
        ) : filteredSubmissions.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-10 text-center">
            <p className="text-lg font-semibold">
              No {filter.toLowerCase()} submissions
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Visitor submissions will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredSubmissions.map((submission) => (
              <article
                key={submission._id}
                className="rounded-xl border border-gray-800 bg-zinc-950 p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {submission.festivalName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {submission.kavuName}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      submission.status === "Pending"
                        ? "bg-yellow-950 text-yellow-300"
                        : submission.status === "Approved"
                          ? "bg-green-950 text-green-300"
                          : "bg-red-950 text-red-300"
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-gray-400">District: </span>
                    {submission.district}
                  </p>

                  <p>
                    <span className="text-gray-400">Festival date: </span>
                    {new Date(submission.date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      }
                    )}
                  </p>

                  <div>
                    <p className="mb-1 text-gray-400">Theyyams:</p>
                    <div className="flex flex-wrap gap-2">
                      {submission.theyyams?.map((theyyam, index) => (
                        <span
                          key={`${theyyam}-${index}`}
                          className="rounded-md bg-zinc-800 px-2 py-1"
                        >
                          {theyyam}
                        </span>
                      ))}
                    </div>
                  </div>

                  {submission.locationLink && (
                    <p>
                      <a
                        href={submission.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 underline hover:text-red-300"
                      >
                        Open Google Maps location
                      </a>
                    </p>
                  )}

                  {submission.submitterName && (
                    <p>
                      <span className="text-gray-400">
                        Submitted by:{" "}
                      </span>
                      {submission.submitterName}
                    </p>
                  )}

                  {submission.contact && (
                    <p className="break-words">
                      <span className="text-gray-400">
                        Contact:{" "}
                      </span>
                      {submission.contact}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    Submitted on{" "}
                    {new Date(submission.createdAt).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>

                {submission.status === "Pending" && (
                  <div className="mt-6 flex gap-3 border-t border-gray-800 pt-4">
                    <button
                      onClick={() =>
                        handleDecision(submission, "approve")
                      }
                      disabled={Boolean(actionId)}
                      className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
                    >
                      {actionId === submission._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleDecision(submission, "reject")
                      }
                      disabled={Boolean(actionId)}
                      className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-800 disabled:opacity-50"
                    >
                      {actionId === submission._id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventSubmissions;