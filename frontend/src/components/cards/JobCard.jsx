import {
  Bookmark,
  Briefcase,
  Building2,
  Clock3,
  DollarSign,
  MapPin,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext.jsx";
import Login from "../../pages/Auth/Login.jsx";

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
  if (!company) {
    return "Company";
  }

  if (typeof company === "string") {
    return "Company";
  }

  return company.companyName || company.name || "Company";
};

const getCompanyInitial = (companyName) => {
  return companyName.trim().charAt(0).toUpperCase() || "C";
};

const JobCard = ({ job, onClick, onToggleSave, onApply }) => {

  const companyName = getCompanyName(job?.company);
  const companyLogo =
    typeof job?.company === "object" ? job?.company?.companyLogo : "";
  const postedAt = job?.createdAt ? moment(job.createdAt).fromNow() : "recently";
  const hasApplied = Boolean(job?.applicationStatus);

  const handleActionClick = (event, action) => {
    event.stopPropagation();
    action?.();
  };

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-lg shadow-gray-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-blue-600">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-base font-bold">
                {getCompanyInitial(companyName)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 text-lg font-bold text-gray-950 transition-colors group-hover:text-blue-600">
              {job?.title || "Untitled job"}
            </h3>
            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-gray-500">
              <Building2 className="size-4 shrink-0" />
              <span className="truncate">{companyName}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={job?.isSaved ? "Remove saved job" : "Save job"}
          onClick={(event) => handleActionClick(event, onToggleSave)}
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            job?.isSaved
              ? "border-blue-100 bg-blue-50 text-blue-600"
              : "border-gray-100 bg-white text-gray-400 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Bookmark
            className="size-5"
            fill={job?.isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
          <MapPin className="size-4 text-gray-400" />
          {job?.location || "Location not set"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
          <Briefcase className="size-4 text-gray-400" />
          {job?.type || "Type not set"}
        </span>
        {job?.category && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
            {job.category}
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
        {job?.description || "No description has been added for this job yet."}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900">
          <DollarSign className="size-4 text-blue-600" />
          {formatSalary(job?.salaryMin, job?.salaryMax)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-4 text-gray-400" />
          Posted {postedAt}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            hasApplied
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {hasApplied ? `Status: ${job.applicationStatus}` : "Open now"}
        </span>

        <button
          type="button"
          disabled={hasApplied || job?.isClosed}
          onClick={(event) => handleActionClick(event, onApply)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
        >
        
          {  hasApplied? "Applied" : "Apply Now"  }
        </button>
      </div>
    </article>
  );
};

export default JobCard;
