import { Briefcase, Clock3, DollarSign, MapPin } from "lucide-react";
import moment from "moment";

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

const JobPosting = ({ job }) => {
  const postedAt = job?.createdAt
    ? `Posted ${moment(job.createdAt).fromNow()}`
    : "Posted date not available";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Briefcase className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900">
                {job?.title || "Untitled job"}
              </h3>
              <p className="text-sm text-gray-500">
                {job?.category || "General role"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {job?.location || "Location not set"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="size-4" />
              {job?.type || "Type not set"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DollarSign className="size-4" />
              {formatSalary(job?.salaryMin, job?.salaryMax)}
            </span>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          <Clock3 className="size-3.5" />
          {postedAt}
        </span>
      </div>
    </div>
  );
};

export default JobPosting;
