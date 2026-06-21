import {
  ArrowLeft,
  Building2,
  ImagePlus,
  Mail,
  Save,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/input/InputField.jsx";
import TextareaField from "../../components/input/TextareaField.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_PATHS } from "../../utils/apipath.js";
import axiosInstance from "../../utils/axiosInstance.js";
import uploadImage from "../../utils/uploadImage.js";

const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CO";

const EditProfileDetails = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || user?.avatar || "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(formData.companyLogo);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Contact name is required";
    }

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "Company name is required";
    }

    if (!formData.companyDescription.trim()) {
      nextErrors.companyDescription = "Company description is required";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      let companyLogo = formData.companyLogo;

      if (logoFile) {
        const uploadResponse = await uploadImage(logoFile);
        companyLogo = uploadResponse.imageUrl || companyLogo;
      }

      const payload = {
        name: formData.name,
        avatar: companyLogo,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        companyLogo,
      };

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        payload,
      );

      updateUser(response.data);
      toast.success("Company profile updated");
      navigate("/company-profile");
    } catch (error) {
      console.error("Failed to update company profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/company-profile")}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="size-4" />
            Back to company profile
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            Edit company profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep your public employer profile accurate for applicants.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="size-24 rounded-2xl border border-gray-100 object-cover"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                {getInitials(formData.companyName || formData.name)}
              </div>
            )}

            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600">
                <ImagePlus className="size-4" />
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Use a square logo for the best result.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Contact name"
              id="name"
              value={formData.name}
              onChange={(event) => handleInputChange("name", event.target.value)}
              error={errors.name}
              required
              icon={User}
            />
            <InputField
              label="Company email"
              id="email"
              value={user?.email || ""}
              disabled
              helperText="Email cannot be changed here."
              icon={Mail}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Company name"
                id="companyName"
                value={formData.companyName}
                onChange={(event) =>
                  handleInputChange("companyName", event.target.value)
                }
                error={errors.companyName}
                required
                icon={Building2}
              />
            </div>
            <div className="sm:col-span-2">
              <TextareaField
                label="Company description"
                id="companyDescription"
                value={formData.companyDescription}
                onChange={(event) =>
                  handleInputChange("companyDescription", event.target.value)
                }
                error={errors.companyDescription}
                required
                rows={7}
                placeholder="Describe your company, culture, mission, and what candidates can expect."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/company-profile")}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProfileDetails;
