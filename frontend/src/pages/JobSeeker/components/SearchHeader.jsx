import { MapPin, Search } from "lucide-react";

const SearchHeader = ({ filters, handleFilterChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="rounded-2xl bg-white px-6 py-7 shadow-xl shadow-gray-200/70 ring-1 ring-gray-100 sm:px-8 lg:px-10">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-950">Find Your Dream Job</h1>
        <p className="mt-2 text-sm text-gray-600">
          Discover opportunities that match your passion
        </p>
      </div>

      <form
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.34fr)_auto]"
        onSubmit={handleSubmit}
      >
        <label className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-colors focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <Search className="size-5 shrink-0 text-gray-400" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(event) => handleFilterChange("keyword", event.target.value)}
            placeholder="Job title, company, or keywords"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </label>

        <label className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-colors focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <MapPin className="size-5 shrink-0 text-gray-400" />
          <input
            type="text"
            value={filters.location}
            onChange={(event) => handleFilterChange("location", event.target.value)}
            placeholder="Location"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </label>

        <button
          type="submit"
          className="h-12 rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Search Jobs
        </button>
      </form>
    </section>
  );
};

export default SearchHeader;
