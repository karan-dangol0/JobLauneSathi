import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, X } from "lucide-react";
import LoadingSpinner from "./../../components/LoadingSpinner";
import axiosInstance from "./../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apipath.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "./../../context/AuthContext";
import FilterContent from "./components/FilterContent.jsx";
import SearchHeader from "./components/SearchHeader.jsx";
import Navbar from "../../components/layout/Navbar.jsx";
import JobCard from "../../components/cards/JobCard.jsx";

const JobSeekerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMObileFilters] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);

  const navigate = useNavigate();

  // filter states

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  // sidebar collapse states
  const [expandedSections, setExpandedSection] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  // function to fetch jobs from api

  const fetchJobs = async (filterParam = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // build query parameters
      const params = new URLSearchParams();

      if (filterParam.keyword) params.append("keyword", filterParam.keyword);
      if (filterParam.location) params.append("location", filterParam.location);
      if (filterParam.minSalary) params.append("minSalary", filterParam.minSalary);
      if (filterParam.maxSalary) params.append("maxSalary", filterParam.maxSalary);
      if (filterParam.type) params.append("type", filterParam.type);
      if (filterParam.category) params.append("category", filterParam.category);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`,
      );

      const jobsData = Array.isArray(response.data) ? response.data : response.data.jobs || [];

      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs", error);
      setError("failed to fetch jobs. Please try again later");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch jobs when filters change (debounced)

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly,
      };
      // only call api if there are meaninfful filters
      const hasFilters = Object.values(apiFilters).some(
        (value) => value !== "" && value !== false && value !== null && value !== undefined,
      );
      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs(); // fetch all jbos if no filters
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timeOutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const toggleSection = (section) => {
    setExpandedSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const MobileFilterOverlay = () => {
    <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-black/50
      "
        onClick={() => setShowMObileFilters(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setShowMObileFilters(false)}
          >
            {" "}
            <X className={`size-5`} />{" "}
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-full pb-20 not-[]:">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expandedSection={expandedSections}
            filtes={filters}
            handleFilterchange={handleFilterChange}
          />
        </div>
      </div>
    </div>;
  };

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }
      fetchJobs();
    } catch (error) {
      console.log("Error:", error);
      toast.error("Something went wrong. Please try again");
    }
  };

  const applyToJob = async (jobId) => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job.");
      navigate("/login");
      return;
    }

    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }
      fetchJobs();
    } catch (error) {
      console.log("Error", error);
      const errorMsg = error?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  if (jobs.length == 0 && loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`bg-linear-to-br from-blue-50 via-white to-purple-50`}>
      <Navbar />
      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Search Header */}
          <SearchHeader filters={filters} handleFilterChange={handleFilterChange} />
          <div className="flex mt-5 gap-6 lg:gap-8">
            {/* Desktop sidebar filters */}
            <div className="hiddden lg:block w-80 shrink-0">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 text-xl mb-6">Filter jobs</h3>
                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Main content */}

            <div className="flex-1 min-w-0">
              {/* Results Header */}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4 ">
                <div className="">
                  <p className="text-gray-600 text-sm lg:text-base">
                    Showing&nbsp;
                    <span className="font-bold text-gray-900">{jobs.length} </span> jobs
                  </p>
                </div>
                <div className="flex items-center justifybetween lg:justify-end gap-4">
                  {/* Mobile filter button */}
                  <button
                    className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMObileFilters(true)}
                  >
                    {" "}
                    <Filter className={`size-4`} />{" "}
                  </button>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                      >
                        <Grid className={`size-4`} />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-Colors ${viewMode === "list" ? "bg-blue-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Job grid */}
              {jobs.length === 0 ? (
                <div className="text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="text-gray-400 mb-6">
                    <Search className={`size-1/6 mb-6`}  />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">No job found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                  <button className="text-gray-600 mb-6" onClick={clearAllFilters}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={`${viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6" : "space-y-4 lg:space-y-6"} `}
                  >
                    {jobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onClick={() => navigate(`/job/${job._id}`)}
                        onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
                        onApply={() => applyToJob(job._id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* mobile filter overlay */}
        <MobileFilterOverlay />
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
