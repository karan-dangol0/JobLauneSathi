import {
  Briefcase,
  Building2,
  Edit3,
  FileText,
  Mail,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_PATHS } from "../../utils/apipath.js";
import axiosInstance from "../../utils/axiosInstance.js";

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CO";

const EmployerProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);

      try {
        const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load company jobs:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const stats = useMemo(() => {
    const openJobs = jobs.filter((job) => !job.isClosed).length;
    const totalApplicants = jobs.reduce(
      (total, job) => total + (job.applicationCount || 0),
      0,
    );

    return {
      totalJobs: jobs.length,
      openJobs,
      totalApplicants,
    };
  }, [jobs]);

  const companyName = user?.companyName || user?.name || "Company name";
  const companyLogo = user?.companyLogo || user?.avatar || "";

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-blue-600 px-6 py-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="size-20 shrink-0 rounded-2xl border border-white/30 bg-white object-cover"
                  />
                ) : (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">
                    {getInitials(companyName)}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold">{companyName}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-100">
                    <Mail className="size-4" />
                    {user?.email || "Email not available"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/edit-company-profile")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Edit3 className="size-4" />
                Edit profile
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Briefcase className="size-4" />
                Total jobs
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {isLoadingJobs ? "-" : stats.totalJobs}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Building2 className="size-4" />
                Open jobs
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {isLoadingJobs ? "-" : stats.openJobs}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Users className="size-4" />
                Applicants
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {isLoadingJobs ? "-" : stats.totalApplicants}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Company description
              </h3>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
              {user?.companyDescription ||
                "Add a company description so applicants can understand your team, mission, and workplace."}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Company details
            </h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Contact name</p>
                <p className="mt-1 text-gray-900">{user?.name || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">{user?.email || "Not set"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Role</p>
                <p className="mt-1 capitalize text-gray-900">
                  {user?.role || "employer"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {isLoadingJobs && <LoadingSpinner />}
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
