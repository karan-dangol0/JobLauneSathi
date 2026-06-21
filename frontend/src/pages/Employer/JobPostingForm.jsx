import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import { MapPin, DollarSign, Users, Briefcase, Eye, Send } from "lucide-react";
import { API_PATHS } from "../../utils/apipath.js";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { CATEGORIES, JOB_TYPES } from "../../utils/data.js";
import toast from "react-hot-toast";
import InputField from "./../../components/input/InputField";
import SelectField from "../../components/input/SelectField.jsx";
import TextareaField from "./../../components/input/TextareaField";
import JobPostingPreview from "../../components/cards/JobPostingPreview.jsx";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoadingJob, setIsLoadingJob] = useState(Boolean(jobId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setIsLoadingJob(false);
      return;
    }

    const fetchJob = async () => {
      setIsLoadingJob(true);

      try {
        const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOB_BY_ID(jobId));
        const job = response.data;

        setFormData({
          jobTitle: job?.title || "",
          location: job?.location || "",
          category: job?.category || "",
          jobType: job?.type || "",
          description: job?.description || "",
          requirements: job?.requirements || "",
          salaryMin: job?.salaryMin ?? "",
          salaryMax: job?.salaryMax ?? "",
        });
      } catch (error) {
        console.error("Failed to load job for editing:", error);
        toast.error("Failed to load job details");
        navigate("/manage-jobs");
      } finally {
        setIsLoadingJob(false);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const jobPayLoad = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };
    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayLoad)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayLoad);
      if (response.status === 200 || response.status === 201) {
        toast.success(jobId ? "Job Updated successfully" : "Job posted successfully");
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });

        navigate("/employer-dashboard");
        return;
      }
      console.error("Unexpected error", response);
      toast.error("Something went wrong. Please try again");
    } catch (error) {
      if (error.response?.data?.message) {
        console.error("API ERROR", error?.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Unexpected error: ", error);
        toast.error("Failed to post/update job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsPreview(true);
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.jobType) {
      errors.jobType = "Job type is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Requirements are required";
    }

    const salaryMin = Number(formData.salaryMin);
    const salaryMax = Number(formData.salaryMax);

    if (formData.salaryMin && (Number.isNaN(salaryMin) || salaryMin < 0)) {
      errors.salaryMin = "Minimum salary must be a valid positive number";
    }

    if (formData.salaryMax && (Number.isNaN(salaryMax) || salaryMax < 0)) {
      errors.salaryMax = "Maximum salary must be a valid positive number";
    }

    if (
      formData.salaryMin &&
      formData.salaryMax &&
      !Number.isNaN(salaryMin) &&
      !Number.isNaN(salaryMax) &&
      salaryMin > salaryMax
    ) {
      errors.salaryMax = "Maximum salary must be greater than minimum salary";
    }

    return errors;
  };
  const isFormValid = () => {
    const validateErrors = validateForm(formData);
    return Object.keys(validateErrors).length === 0;
  };

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  if (isLoadingJob) {
    return (
      <DashboardLayout activeMenu="post-job">
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-gray-500">
          Loading job details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu={"post-job"}>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="">
                <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {jobId ? "Edit Job" : "Post a new Job"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {jobId
                    ? "Update the job details below."
                    : "Fill out the form below to create your job posting."}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePreview}
                  className={`group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  <Eye className="size-4 transition-transform group-hover:-translate-x-1" />
                  <span className="">Preview </span>
                </button>
              </div>
            </div>

            <div className="space-y-6 ">
              <InputField
                label="Job title"
                id="jobTitle"
                placeholder="e.g. Senior Devops"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />
              {/* Location && remote */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0 ">
                  <div className="flex-1">
                    <InputField
                      label="location"
                      id="location"
                      placeholder="kathmadu"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      error={errors.location}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/* Category && job Type */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={CATEGORIES}
                  placeholder={"Select a category"}
                  error={errors.category}
                  required
                  icon={Users}
                />
                <SelectField
                  label="Job Type"
                  id="jobType"
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  options={JOB_TYPES}
                  placeholder={"Select job type"}
                  error={errors.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              {/* Category & job Types */}

              <TextareaField
                label="Job Description"
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                options={CATEGORIES}
                error={errors.description}
                placeholder="Describe the role and responsibilities"
                helperText="Include key responsilities, day to day and what makes this role exciting"
                required
              />
              {/* Requirement */}
              <TextareaField
                label="Requirement"
                id="requirement"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder={"List key qualification and skills"}
                error={errors.requirements}
                helperText="Include required skills, experience leve, education, and any preferred qualification"
                required
              />

              {/* Salary Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Minimum Salary"
                  id="salaryMin"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                  error={errors.salaryMin}
                  icon={DollarSign}
                />
                <InputField
                  label="Maximum Salary"
                  id="salaryMax"
                  type="number"
                  placeholder="e.g. 90000"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                  error={errors.salaryMax}
                  icon={DollarSign}
                />
              </div>

              {/* Submit Button */}
              <div className="w-full pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid()}
                  className="group w-full flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
                >
                  <Send className="size-4 transition-transform group-hover:translate-x-1" />
                  <span>
                    {isSubmitting
                      ? jobId
                        ? "Updating..."
                        : "Posting..."
                      : jobId
                        ? "Update Job"
                        : "Post Job"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;
