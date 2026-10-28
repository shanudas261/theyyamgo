import { useState } from "react";

import Navbar from "./components/Navbar";
import SearchBar from "./components/Searchbar";
import TheyyamMap from "./components/map/TheyyamMap";

function App() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All dates");
  const [districtFilter, setDistrictFilter] = useState("All districts");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.70),
            rgba(0, 0, 0, 0.85)
          ),
          url("/images/1000360347.png")
        `,
      }}
    >
      <Navbar />

      <main className="px-5 py-8 md:px-10">
        <section className="mb-6">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Discover Theyyam
            <span className="text-red-600"> near you</span>
          </h1>

          <p className="mt-2 text-gray-300">
            Explore Theyyam performances and Kavus across North Kerala.
          </p>
        </section>

        <SearchBar
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
        />

        <TheyyamMap
          search={search}
          dateFilter={dateFilter}
          districtFilter={districtFilter}
        />
      </main>
    </div>
  );
}

export default App;