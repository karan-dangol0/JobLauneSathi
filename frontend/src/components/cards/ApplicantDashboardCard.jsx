import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  const applicantName =
    typeof applicant === "object" && applicant?.name
      ? applicant.name
      : "Applicant";

  const initials =
    applicantName
      .split(" ")
      .filter(Boolean)
      .map((namePart) => namePart[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:border-gray-200">
      <div className="flex min-w-0 items-center space-x-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-400 to-indigo-500">
          <span className="text-sm font-medium text-white">{initials}</span>
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-[15px] font-medium text-gray-900">
            {applicantName}
          </h4>
          <p className="truncate text-sm text-gray-500">
            {position || "Position unavailable"}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center space-x-3">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="size-3 mr-1" />
          {time || "Recently"}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
