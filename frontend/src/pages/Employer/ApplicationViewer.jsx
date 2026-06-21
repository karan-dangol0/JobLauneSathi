import { ArrowLeft, Briefcase, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicantProfilePreview from "../../components/cards/ApplicantProfilePreview.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { API_PATHS } from "../../utils/apipath.js";
import axiosInstance from "../../utils/axiosInstance.js";

const ApplicationViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(jobId));
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);

  const job = useMemo(() => applications[0]?.job || null, [applications]);

  useEffect(() => {
    if (!jobId) {
      toast.error("Select a job to view applicants");
      navigate("/manage-jobs");
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);

      try {
        const response = await axiosInstance.get(
          API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId),
        );
        setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
        toast.error("Failed to load applicants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [jobId, navigate]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingApplicationId(applicationId);

    try {
      await axiosInstance.put(API_PATHS.APPLICATIONS.UPDATE_STATUS(applicationId), {
        status,
      });
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application,
        ),
      );
      toast.success("Application status updated");
    } catch (error) {
      console.error("Failed to update application status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingApplicationId(null);
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
            <button
              type="button"
              onClick={() => navigate("/manage-jobs")}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="size-4" />
              Back to jobs
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {job?.title ? `${job.title} Applicants` : "Applicants"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review applicants, view resumes, and update application status.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">
                Total applicants
              </p>
              <p className="text-xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="size-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No applicants yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Applications for this job will appear here once job seekers apply.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => (
              <ApplicantProfilePreview
                key={application._id}
                application={application}
                isUpdating={updatingApplicationId === application._id}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationViewer;
