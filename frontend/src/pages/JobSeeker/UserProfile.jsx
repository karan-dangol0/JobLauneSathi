import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Briefcase,
  Download,
  FileText,
  Mail,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/input/InputField";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { API_PATHS, BASE_URL } from "../../utils/apipath";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
};

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

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingResume, setIsDeletingResume] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      avatar: user?.avatar || "",
      resume: user?.resume || "",
    });
  }, [user]);

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return formData.avatar;
  }, [avatarFile, formData.avatar]);

  const resumeUrl = getFileUrl(formData.resume);
  const selectedResumeName = resumeFile?.name || "";

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file for your avatar.");
      return;
    }

    setAvatarFile(file);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload your resume as a PDF.");
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      let avatar = formData.avatar;
      let resume = formData.resume;

      if (avatarFile) {
        const avatarUpload = await uploadImage(avatarFile);
        avatar = avatarUpload.imageUrl || avatar;
      }

      if (resumeFile) {
        const resumeUpload = await uploadImage(resumeFile);
        resume = resumeUpload.imageUrl || resume;
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name.trim(),
        avatar,
        resume,
      });

      updateUser(response.data);
      setAvatarFile(null);
      setResumeFile(null);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!formData.resume) {
      return;
    }

    try {
      setIsDeletingResume(true);
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_RESUME, {
        data: { resumeUrl: formData.resume },
      });

      const updatedUser = { ...user, resume: "" };
      updateUser(updatedUser);
      setFormData((prev) => ({ ...prev, resume: "" }));
      setResumeFile(null);
      toast.success("Resume removed successfully.");
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error(error?.response?.data?.message || "Failed to delete resume.");
    } finally {
      setIsDeletingResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/find-jobs")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          Find jobs
        </button>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-blue-100 text-blue-700">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={formData.name || "Profile avatar"}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {getInitials(formData.name)}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-3xl font-bold text-gray-950">
                  {formData.name || "Your Profile"}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="size-4" />
                  {user?.email || "Email not available"}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="size-4" />
                  {user?.role || "jobseeker"}
                </p>
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:text-blue-600">
              <Upload className="size-4" />
              Change avatar
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Full name"
                id="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                error={errors.name}
                required
                icon={User}
              />

              <InputField
                label="Email"
                id="email"
                value={user?.email || ""}
                disabled
                helperText="Email cannot be changed here."
                icon={Mail}
              />
            </div>

            <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-950">Resume</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a PDF resume for employers to review.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700">
                  <Upload className="size-4" />
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                {selectedResumeName || resumeUrl ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {selectedResumeName || formData.resume.split("/").pop()}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {selectedResumeName
                          ? "Ready to save"
                          : "Current resume"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {resumeUrl && !selectedResumeName && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:text-blue-600"
                        >
                          <Download className="size-4" />
                          View
                        </a>
                      )}
                      {formData.resume && (
                        <button
                          type="button"
                          onClick={handleDeleteResume}
                          disabled={isDeletingResume}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 className="size-4" />
                          {isDeletingResume ? "Removing..." : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No resume uploaded yet.</p>
                )}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                    avatar: user?.avatar || "",
                    resume: user?.resume || "",
                  });
                  setAvatarFile(null);
                  setResumeFile(null);
                }}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                {isSaving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
