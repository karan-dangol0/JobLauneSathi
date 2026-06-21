import {
  Briefcase,
  CalendarClock,
  Download,
  Eye,
  Mail,
  User,
  X,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { BASE_URL } from "../../utils/apipath.js";

const APPLICATION_STATUSES = ["Applied", "In Review", "Rejected", "Accepted"];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "NA";

const getFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const normalizedPath = filePath.replaceAll("\\", "/");
  return normalizedPath.startsWith("/")
    ? `${BASE_URL}${normalizedPath}`
    : `${BASE_URL}/${normalizedPath}`;
};

const ApplicantProfilePreview = ({
  application,
  isUpdating,
  onStatusChange,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const applicant = application?.applicant || {};
  const job = application?.job || {};
  const resumeUrl = getFileUrl(application?.resume || applicant?.resume);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-gray-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          {applicant.avatar ? (
            <img
              src={applicant.avatar}
              alt={applicant.name || "Applicant"}
              className="size-12 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
              {getInitials(applicant.name)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {applicant.name || "Unnamed applicant"}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="size-4" />
              {applicant.email || "Email not available"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {job.title || "Job title unavailable"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4" />
                Applied {moment(application.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <select
            value={application.status || "Applied"}
            onChange={(e) => onStatusChange(application._id, e.target.value)}
            disabled={isUpdating}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600"
          >
            <User className="size-4" />
            View profile
          </button>

          <a
            href={resumeUrl || undefined}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              resumeUrl
                ? "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                : "pointer-events-none border-gray-100 text-gray-300"
            }`}
          >
            <Eye className="size-4" />
            Resume
          </a>

          <a
            href={resumeUrl || undefined}
            download
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              resumeUrl
                ? "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                : "pointer-events-none border-gray-100 text-gray-300"
            }`}
          >
            <Download className="size-4" />
            Download
          </a>
        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4 py-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                {applicant.avatar ? (
                  <img
                    src={applicant.avatar}
                    alt={applicant.name || "Applicant"}
                    className="size-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white">
                    {getInitials(applicant.name)}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-gray-900">
                    {applicant.name || "Unnamed applicant"}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Mail className="size-4" />
                    {applicant.email || "Email not available"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                aria-label="Close applicant profile"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Applicant</p>
                <p className="mt-1 text-gray-900">
                  {applicant.name || "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Email</p>
                <p className="mt-1 text-gray-900">
                  {applicant.email || "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Status</p>
                <p className="mt-1 text-gray-900">
                  {application.status || "Applied"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Applied for</p>
                <p className="mt-1 text-gray-900">
                  {job.title || "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Applied on</p>
                <p className="mt-1 text-gray-900">
                  {application.createdAt
                    ? moment(application.createdAt).format("MMM D, YYYY")
                    : "Not available"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium text-gray-500">Resume</p>
                <p className="mt-1 text-gray-900">
                  {resumeUrl ? "Available" : "Not uploaded"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <a
                href={resumeUrl || undefined}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  resumeUrl
                    ? "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                    : "pointer-events-none border-gray-100 text-gray-300"
                }`}
              >
                <Eye className="size-4" />
                View resume
              </a>
              <a
                href={resumeUrl || undefined}
                download
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  resumeUrl
                    ? "border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                    : "pointer-events-none border-gray-100 text-gray-300"
                }`}
              >
                <Download className="size-4" />
                Download resume
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantProfilePreview;
