import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  ListChecks,
  MapPin,
  Tag,
} from "lucide-react";
import moment from "moment";
import Navbar from "../../components/layout/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apipath";
import { useAuth } from "../../context/AuthContext";

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

const getCompanyName = (company) => {
  if (!company || typeof company === "string") {
    return "Company";
  }

  return company.companyName || company.name || "Company";
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
          <p className="mt-1 text-sm font-bold text-gray-900">
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContentSection = ({ icon: Icon, title, children }) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-950">{title}</h2>
      </div>
      <div className="whitespace-pre-line text-sm leading-7 text-gray-600">
        {children || "Not specified"}
      </div>
    </section>
  );
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (user?._id) {
        params.append("userId", user._id);
      }

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_JOB_BY_ID(jobId)}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
      );

      setJob(response.data);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      setError(err?.response?.data?.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId, user?._id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job.");
      navigate("/login");
      return;
    }

    if (user?.role !== "jobseeker") {
      toast.error("Only job seekers can apply to jobs.");
      return;
    }

    try {
      setApplying(true);
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Applied to job successfully!");
      setJob((prev) => ({ ...prev, applicationStatus: "Applied" }));
    } catch (err) {
      console.error("Failed to apply to job:", err);
      toast.error(err?.response?.data?.message || "Failed to apply to this job.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 pt-28 text-center sm:px-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-950">Job not found</h1>
            <p className="mt-3 text-sm text-gray-600">
              {error || "This job may have been removed or is no longer available."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/find-jobs")}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Back to jobs
            </button>
          </div>
        </main>
      </div>
    );
  }

  const companyName = getCompanyName(job.company);
  const companyLogo =
    typeof job.company === "object" ? job.company?.companyLogo : "";
  const hasApplied = Boolean(job.applicationStatus);
  const postedAt = job.createdAt ? moment(job.createdAt).fromNow() : "recently";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-100 text-blue-600">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-8" />
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {job.category || "General"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      job.isClosed
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {job.isClosed ? "Closed" : "Open"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl">
                  {job.title || "Untitled job"}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="size-4" />
                    {companyName}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {job.location || "Location not set"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4" />
                    Posted {postedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:min-w-48">
              {hasApplied && (
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  {job.applicationStatus}
                </span>
              )}
              <button
                type="button"
                disabled={hasApplied || job.isClosed || applying}
                onClick={handleApply}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
              >
                {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem icon={Briefcase} label="Job Type" value={job.type} />
          <DetailItem
            icon={DollarSign}
            label="Salary"
            value={formatSalary(job.salaryMin, job.salaryMax)}
          />
          <DetailItem icon={Tag} label="Category" value={job.category} />
          <DetailItem icon={MapPin} label="Location" value={job.location} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <ContentSection icon={FileText} title="Job Description">
              {job.description}
            </ContentSection>
            <ContentSection icon={ListChecks} title="Requirements">
              {job.requirements}
            </ContentSection>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-950">Company</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-blue-600">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-6" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {companyName}
                </p>
                <p className="text-xs text-gray-500">
                  {job.category || "Hiring team"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Briefcase className="size-4 text-blue-600" />
                {job.type || "Job type not set"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-blue-600" />
                {job.location || "Location not set"}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 className="size-4 text-blue-600" />
                Posted {postedAt}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
