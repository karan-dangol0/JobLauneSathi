import { Briefcase, Clock3, MapPin } from "lucide-react";
import moment from "moment";

const JobDashboardCard = ({ job }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 transition-colors duration-200 hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Briefcase className="size-4" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-gray-900">
                {job?.title || "Untitled job"}
              </h4>
              <p className="text-xs text-gray-500">
                {job?.category || "General role"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {job?.location || "Location not set"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" />
              {job?.type || "Type not set"}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            job?.isClosed
              ? "bg-red-100 text-red-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {job?.isClosed ? "Closed" : "Open"}
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Posted {moment(job?.createdAt).fromNow()}
      </p>
    </div>
  );
};

export default JobDashboardCard;
