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
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0.92)
          ),
          url("/images/1000360347.png")
        `,
      }}
    >
      <Navbar />

      <main className="px-5 py-8 md:px-10 lg:px-16">
        {/* Hero */}
        <section className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            Discover the heritage of North Kerala
          </p>

          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Discover Theyyam
            <span className="text-red-600"> near you</span>
          </h1>

          <p className="mt-4 leading-7 text-gray-300 md:text-lg">
            Explore Theyyam performances, discover sacred Kavus, and find
            festival information across North Kerala.
          </p>
        </section>

        {/* Search and filters */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
        />

        {/* Interactive map */}
        <section className="mt-6" id="explore">
          <TheyyamMap
            search={search}
            dateFilter={dateFilter}
            districtFilter={districtFilter}
          />
        </section>

        {/* About Theyyam */}
        <section id="theyyam-info" className="mt-16 rounded-2xl border border-white/10 bg-black/50 px-6 py-10 backdrop-blur-sm md:px-12 md:py-12 scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            A living tradition
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            What is Theyyam?
          </h2>

          <p className="mt-5 max-w-4xl leading-7 text-gray-300">
            Theyyam is a traditional ritual art form of North Kerala, especially
            Kannur and Kasaragod. It brings together elaborate costumes, vivid
            face painting, music, dance, and sacred ceremonies.
          </p>

          <p className="mt-4 max-w-4xl leading-7 text-gray-300">
            Rooted in local beliefs and community traditions, Theyyam preserves
            stories and customs passed down through generations. Every
            performance has its own identity, history, and cultural
            significance.
          </p>
        </section>

        {/* About TheyyamGo */}
        <section id="about" className="my-16 rounded-2xl border border-red-900/40 bg-gradient-to-br from-red-950/60 to-black/80 px-6 py-10 md:px-12 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
              Our purpose
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              About <span className="text-red-500">TheyyamGo</span>
            </h2>

            <p className="mt-6 leading-8 text-gray-300">
              TheyyamGo helps people discover Theyyam traditions and explore
              Kavus across North Kerala in one place. Our goal is to make it
              easier for visitors, culture enthusiasts, and local communities to
              find festival information and learn about the heritage behind each
              destination.
            </p>

            <p className="mt-4 leading-8 text-gray-300">
              By bringing locations and event information together on an
              interactive map, we hope to make cultural exploration simpler and
              help more people appreciate these living traditions.
            </p>

            <div className="mt-8">
              <span className="inline-block rounded-full border border-red-500/50 px-5 py-2 text-sm font-medium text-red-300">
                Discover · Explore · Preserve
              </span>
            </div>
          </div>
        </section>

       
          {/* Footer */}
          <footer className="mt-12 border-t border-white/10 py-8 text-center">
            <p className="text-sm text-gray-400">
              TheyyamGo — Discover the traditions of North Kerala.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
              <a
                href="mailto:shanudas261@gmail.com"
                className="text-gray-300 transition hover:text-red-400"
              >
                Email us
              </a>

              <a
                href="https://wa.me/8281203973"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 transition hover:text-green-400"
              >
                WhatsApp
              </a>
            </div>

            <p className="mt-5 text-xs text-gray-500">
              © {new Date().getFullYear()} TheyyamGo. All rights reserved.
            </p>
          </footer>

         
        P
      </main>
    </div>
  );
}

export default App;
