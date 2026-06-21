import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  CalendarClock,
  Edit3,
  Eye,
  MapPin,
  PauseCircle,
  PlayCircle,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { API_PATHS } from "../../utils/apipath.js";
import axiosInstance from "../../utils/axiosInstance.js";

const formatSalary = (salaryMin, salaryMax) => {
  if (!salaryMin && !salaryMax) {
    return "Salary not specified";
  }

  if (salaryMin && salaryMax) {
    return `$${Number(salaryMin).toLocaleString()} - $${Number(salaryMax).toLocaleString()}`;
  }

  if (salaryMin) {
    return `From $${Number(salaryMin).toLocaleString()}`;
  }

  return `Up to $${Number(salaryMax).toLocaleString()}`;
};

const getPostedTime = (createdAt) => {
  if (!createdAt) {
    return "Posted date unavailable";
  }

  return `Posted ${moment(createdAt).fromNow()}`;
};

const JOBS_PER_PAGE = 5;

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [actionJobId, setActionJobId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch employer jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        [job.title, job.location, job.category, job.type]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "open" && !job.isClosed) ||
        (statusFilter === "closed" && job.isClosed);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const sortedJobs = useMemo(() => {
    const jobsToSort = [...filteredJobs];

    switch (sortFilter) {
      case "applicants-desc":
        return jobsToSort.sort(
          (a, b) => (b.applicationCount || 0) - (a.applicationCount || 0),
        );
      case "applicants-asc":
        return jobsToSort.sort(
          (a, b) => (a.applicationCount || 0) - (b.applicationCount || 0),
        );
      case "newest":
        return jobsToSort.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      case "oldest":
        return jobsToSort.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
        );
      default:
        return jobsToSort;
    }
  }, [filteredJobs, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / JOBS_PER_PAGE));
  const pageStartIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(
    pageStartIndex,
    pageStartIndex + JOBS_PER_PAGE,
  );
  const showingFrom = sortedJobs.length === 0 ? 0 : pageStartIndex + 1;
  const showingTo = Math.min(pageStartIndex + JOBS_PER_PAGE, sortedJobs.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openJobsCount = jobs.filter((job) => !job.isClosed).length;
  const closedJobsCount = jobs.length - openJobsCount;
  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicationCount || 0),
    0,
  );

  const handleToggleClose = async (jobId) => {
    setActionJobId(jobId);

    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isClosed: !job.isClosed } : job,
        ),
      );
      toast.success("Job status updated");
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setActionJobId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    toast(
      (confirmationToast) => (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-900">
            Are you sure you want to delete this job?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(confirmationToast.id)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(confirmationToast.id);
                deleteJob(jobId);
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  const deleteJob = async (jobId) => {
    setActionJobId(jobId);

    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs((prevJobs) => prevJobs.filter((job)=> job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job");
    } finally {
      setActionJobId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="manage-jobs">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track, edit, close, and review applications for your job posts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/post-job")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition-colors hover:bg-blue-700"
          >
            <Briefcase className="size-4" />
            Post job
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {jobs.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Open Jobs</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {openJobsCount}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Applicants</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {totalApplicants}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
              {["all", "open", "closed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {status}
                </button>
                ))}
            </div>

            <div className="relative w-full sm:w-56">
              <SlidersHorizontal className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-gray-600 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="default">Sort jobs</option>
                <option value="applicants-desc">Most applicants</option>
                <option value="applicants-asc">Fewest applicants</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Briefcase className="size-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Adjust your search or create a new job post to start receiving
                  applicants.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="grid gap-4 bg-white p-4 transition-colors hover:bg-gray-50 lg:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {job.title || "Untitled job"}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            job.isClosed
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {job.isClosed ? "Closed" : "Open"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {job.location || "Location not set"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="size-4" />
                          {job.type || "Type not set"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="size-4" />
                          {getPostedTime(job.createdAt)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-medium text-gray-900">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-500">
                          {job.category || "No category"}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                          <Users className="size-4" />
                          {job.applicationCount || 0} applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/applicants", { state: { jobId: job._id } })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                      >
                        <Eye className="size-4" />
                        Applicants
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/post-job", { state: { jobId: job._id } })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                      >
                        <Edit3 className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleClose(job._id)}
                        disabled={actionJobId === job._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-amber-200 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {job.isClosed ? (
                          <PlayCircle className="size-4" />
                        ) : (
                          <PauseCircle className="size-4" />
                        )}
                        {job.isClosed ? "Reopen" : "Close"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={actionJobId === job._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sortedJobs.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {showingFrom}-{showingTo} out of {sortedJobs.length} jobs
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`size-9 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
