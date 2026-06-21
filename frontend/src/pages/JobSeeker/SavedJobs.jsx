import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Bookmark, Grid, List, Search } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobCard from "../../components/cards/JobCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apipath";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const normalizeSavedJobs = (items) => {
    return items
      .map((item) => {
        const job = item?.job || item;

        if (!job?._id) {
          return null;
        }

        return {
          ...job,
          isSaved: true,
          savedJobId: item?._id,
        };
      })
      .filter(Boolean);
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      const data = Array.isArray(response.data) ? response.data : [];

      setSavedJobs(normalizeSavedJobs(data));
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
      setError(err?.response?.data?.message || "Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job removed from saved list.");
    } catch (err) {
      console.error("Failed to remove saved job:", err);
      toast.error(err?.response?.data?.message || "Failed to remove saved job.");
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      setSavedJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, applicationStatus: "Applied" } : job,
        ),
      );
      toast.success("Applied to job successfully!");
    } catch (err) {
      console.error("Failed to apply to job:", err);
      toast.error(err?.response?.data?.message || "Failed to apply to this job.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/find-jobs")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Find jobs
        </button>

        <section className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Bookmark className="size-6" fill="currentColor" />
              </div>
              <h1 className="text-3xl font-bold text-gray-950">Saved Jobs</h1>
              <p className="mt-2 text-sm text-gray-600">
                Keep track of roles you want to revisit or apply to later.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
              <p className="text-3xl font-bold text-blue-700">
                {savedJobs.length}
              </p>
              <p className="text-xs font-semibold uppercase text-blue-600">
                Saved
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">
              Could not load saved jobs
            </h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              type="button"
              onClick={fetchSavedJobs}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Try again
            </button>
          </section>
        ) : savedJobs.length === 0 ? (
          <section className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Search className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">
              No saved jobs yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Save jobs from the job board and they will appear here for quick
              access.
            </p>
            <button
              type="button"
              onClick={() => navigate("/find-jobs")}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse jobs
            </button>
          </section>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold text-gray-950">
                  {savedJobs.length}
                </span>{" "}
                saved jobs
              </p>

              <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Grid className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            <section
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-5 lg:grid-cols-2"
                  : "space-y-5"
              }
            >
              {savedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => navigate(`/job/${job._id}`)}
                  onToggleSave={() => handleRemoveSavedJob(job._id)}
                  onApply={() => handleApply(job._id)}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
