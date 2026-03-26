import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { validateEmail, validatePassword, validateAvatar } from "../../utils/helper";
import uploadImage from "./../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apipath";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });
  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };
  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role: "" },
      }));
    }
  };
  {
    /*  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },
        }));

        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));

      //create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: { ...prev.errors, avatar: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };*/
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateAvatar(file); // make sure this passes
    if (error) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, avatar: error },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);

    setFormState((prev) => ({
      ...prev,
      avatarPreview: previewUrl,
      errors: { ...prev.errors, avatar: "" },
    }));
  };
  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName ? "Enter full Name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Please select a role" : "",
      avatar: "",
    };

    // remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      let avatarUrl = "";
      // upload image if present
      if (formData.avatar) {
        const imgUploadRes = await uploadImage(formData.avatar);
        avatarUrl = imgUploadRes.imageUrl || "";

      }
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          avatar: avatarUrl || ""
        });
        // handle successful registration 
        setFormState((prev) => ({
          ...prev,
          loading: false,
          success: true,
          errors: {},
        }));
        const { token } = response.data;
        if (token) {
          login(response.data, token);
          
          // redirect based on role
          setTimeout(() => {
            window.location.href = formData.role === "employer" ? "employer-dashboard" : "/find-jobs"; 
          }, );
        }
    } catch (error) {
      console.log("Error", error);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit: error.response?.data?.message || "Registration failed. Please try again.",
        },
      }));
    }
  };
  useEffect(() => {
    return () => {
      if (formState.avatarPreview) {
        URL.revokeObjectURL(formState.avatarPreview);
      }
    };
  }, [formState.avatarPreview]);

  if (formState.success) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg max-w-md w-full text-center p-8"
        >
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mx-auto mb-4">Account Created!</h2>
          <p className="text-gray-600 mb-4">You can now successfully log in.</p>
          <div className="animate-spin size-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard</p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-sm text-gray-600">
            Join thousands of professionals finding their dream job.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transition -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                name="fullName"
                id=""
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 py-3 rounded-lg border ${formState.errors.fullName ? "border-red-500 " : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="Enter your full Name"
              />
            </div>
            {formState.errors.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="size-5 mr-1" />
                {formState.errors.fullName}
              </p>
            )}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address*
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transition -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="email"
                name="email"
                id=""
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 py-3 rounded-lg border ${formState.errors.email ? "border-red-500 " : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors `}
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="size-5 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
              <input
                type={`${formState.showPassword ? "text" : "password"}`}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${formState.errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {formState.showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p className="text-red-500 text-sm  mt-1 flex items-center">
                <AlertCircle className="size-5 mr-1 " />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Avatar Upload */}

          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture (optional)
            </label>
            <div className="flex items-center space-x-4">
              <div
                className="size-16 rounded-full bg-gray-100 flex justify-center items-center overflow-hidden
              "
              >
                {formState.avatarPreview ? (
                  <img src={formState.avatarPreview} alt="" className="size-full object-cover" />
                ) : (
                  <User className="size-8 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100  transition-colors flex  items-center space-x-2"
                >
                  <Upload className="size-4" />
                  <span>Upload Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
            {formState.errors.avatar && (
              <p className="text-red-500 text-sm mt-1 flex  items-center">
                <AlertCircle className="size-4 mr-1" />
                {formState.errors.avatar}
              </p>
            )}
          </div>

          {/* Role Selection  */}

          <div>
            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-3">
              I am a *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === "jobseeker" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}
              >
                <UserCheck className="size-8 mx-auto mb-2" />
                <div className="font-medium">Job Seeker</div>
                <div className="text-xs text-gray-500">Looking for opportunities</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === "employer" ? "border-blue-500 bg-blue-50 text-blue-700 " : "border-gray-200 hover:border-gray-300"}`}
              >
                <Building2 className="size-8  mx-auto mb-2" />
                <div className="font-medium">Employer</div>
                <div className="text-xs text-gray-500">Hiring talent</div>
              </button>
            </div>
            {formState.errors.role && (
              <p className="text-red-500 text-sm mt-2 flex items-center ">
                <AlertCircle className="size-4 mr-1" />
                {formState.errors.role}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="size-4 mr-2" />
                {formState.errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2 py-3 rounded-lg text-white hover:from-blue-700 hover:to-purple-700"
          >
            {formState.loading ? (
              <>
                <Loader className="size-5  animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* login Link */}

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
