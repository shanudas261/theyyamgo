function SearchBar({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  districtFilter,
  setDistrictFilter,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-800 bg-black px-4 py-3 shadow-sm">
        <span className="text-red-600">🔍</span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Theyyam, Kavu or district..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
        />
      </div>

      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-gray-300 outline-none focus:border-red-600"
      >
        <option>All dates</option>
        <option>Today</option>
        <option>This week</option>
        <option>This month</option>
      </select>

      <select
        value={districtFilter}
        onChange={(e) => setDistrictFilter(e.target.value)}
        className="rounded-xl border border-gray-800 bg-black px-4 py-3 text-sm text-gray-300 outline-none focus:border-red-600"
      >
        <option>All districts</option>
        <option>Kannur</option>
        <option>Kasaragod</option>
        <option>Kozhikode</option>
        <option>Wayanad</option>
        <option>Malappuram</option>
      </select>
    </div>
  );
}

export default SearchBar;