import { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import EventCard from "../Event/EventCard";

// Custom Theyyam marker
const TheyyamIcon = L.divIcon({
  className: "bg-transparent border-0",
  html: `
    <div class="relative flex h-10 w-10 items-center justify-center">
      <div class="absolute h-10 w-10 animate-pulse rounded-full bg-red-600/30 shadow-[0_0_10px_rgba(239,68,68,0.9),0_0_25px_rgba(220,38,38,0.7)]"></div>

      <div class="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-500 bg-black shadow-[0_0_12px_rgba(239,68,68,0.9)]">
        <div class="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapController({ kavus }) {
  const map = useMap();

  useEffect(() => {
    if (kavus.length === 0) {
      return;
    }

    if (kavus.length === 1) {
      const kavu = kavus[0];

      map.flyTo(
        [
          kavu.location.latitude,
          kavu.location.longitude,
        ],
        13,
        { duration: 1 }
      );

      return;
    }

    const bounds = kavus.map((kavu) => [
      kavu.location.latitude,
      kavu.location.longitude,
    ]);

    map.flyToBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12,
      duration: 1,
    });
  }, [kavus, map]);

  return null;
}

function TheyyamMap({
  search,
  dateFilter,
  districtFilter,
}) {
  const [selectedKavu, setSelectedKavu] = useState(null);
  const [kavus, setKavus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Kavus from the backend
  useEffect(() => {
    async function fetchKavus() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/kavus"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Kavus");
        }

        const result = await response.json();

        setKavus(result.data);
      } catch (error) {
        console.error("Error fetching Kavus:", error);
        setError("Unable to load Theyyam locations.");
      } finally {
        setLoading(false);
      }
    }

    fetchKavus();
  }, []);

  // Filter Kavus
  const filteredKavus = kavus.filter((kavu) => {
    const searchText = (search || "").toLowerCase();

    // Search by Kavu, district, or Theyyam name
    const matchesSearch =
      kavu.name.toLowerCase().includes(searchText) ||
      kavu.district.toLowerCase().includes(searchText) ||
      kavu.events.some((event) =>
        event.theyyams.some((theyyam) =>
          theyyam.toLowerCase().includes(searchText)
        )
      );

    // Filter by district
    const matchesDistrict =
      districtFilter === "All districts" ||
      kavu.district === districtFilter;

    // Filter by date
    const matchesDate =
      dateFilter === "All dates" ||
      kavu.events.some((event) => {
        const eventDate = new Date(event.date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        if (dateFilter === "Today") {
          return eventDate.getTime() === today.getTime();
        }

        if (dateFilter === "This week") {
          const day = today.getDay();

          const monday = new Date(today);
          monday.setDate(
            today.getDate() - (day === 0 ? 6 : day - 1)
          );

          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);

          return eventDate >= monday && eventDate <= sunday;
        }

        if (dateFilter === "This month") {
          return (
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          );
        }

        return true;
      });

    return matchesSearch && matchesDistrict && matchesDate;
  });

  return (
    <div className="mx-auto mt-6 w-full max-w-5xl">
      {/* Loading message */}
      {loading && (
        <p className="mb-3 text-sm text-white">
          Loading Theyyam locations...
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p className="mb-3 text-sm text-gray-300">
          {filteredKavus.length} Kavu
          {filteredKavus.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Map */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border-4 border-black shadow-2xl md:h-[450px] lg:h-[500px]">
        
  <MapContainer
  center={[11.75, 75.3]}
  zoom={8}
  scrollWheelZoom={true}
  className="h-full w-full"
>
  <MapController kavus={filteredKavus} />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url={`https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`}
            maxZoom={20}
          />

          {filteredKavus.map((kavu) => (
            <Marker
              key={kavu._id}
              position={[
                kavu.location.latitude,
                kavu.location.longitude,
              ]}
              icon={TheyyamIcon}
              eventHandlers={{
                click: () => setSelectedKavu(kavu),
              }}
            />
          ))}
        </MapContainer>

        {/* Selected Kavu card */}
        {selectedKavu && (
          <EventCard
            kavu={selectedKavu}
            onClose={() => setSelectedKavu(null)}
          />
        )}
      </div>

      {/* No results message */}
      {!loading && !error && filteredKavus.length === 0 && (
        <p className="mt-4 text-center text-gray-400">
          No Kavus found. Try changing your search or filters.
        </p>
      )}
    </div>
  );
}

export default TheyyamMap;