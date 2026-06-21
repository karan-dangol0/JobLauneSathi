import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  FileText,
  ListChecks,
  MapPin,
  Tag,
  Timer,
} from "lucide-react";
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

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-blue-600" />
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-600 whitespace-pre-line">
        {children || "Not specified"}
      </div>
    </section>
  );
};

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const postedAt = formData?.createdAt
    ? `Posted ${moment(formData.createdAt).fromNow()}`
    : "Posted just now";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 px-4 py-8 sm:px-6 lg:px-2">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft className="size-4" />
            Edit job
          </button>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Preview
          </span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="border-b border-gray-100 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white">
                <Briefcase className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData?.jobTitle || "Untitled job"}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {formData?.location || "Location not specified"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="size-4" />
                    {formData?.jobType || "Job type not specified"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Timer className="size-4" />
                    {postedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DetailItem
              icon={Tag}
              label="Category"
              value={formData?.category}
            />
            <DetailItem
              icon={Briefcase}
              label="Job Type"
              value={formData?.jobType}
            />
            <DetailItem
              icon={DollarSign}
              label="Salary"
              value={formatSalary(formData?.salaryMin, formData?.salaryMax)}
            />
          </div>

          <div className="mt-8 space-y-8">
            <Section icon={FileText} title="Job Description">
              {formData?.description}
            </Section>
            <Section icon={ListChecks} title="Requirements">
              {formData?.requirements}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
