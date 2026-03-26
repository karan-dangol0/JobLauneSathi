import { API_PATHS } from "./apipath.js";
import axiosInstance from "./axiosInstance.js";

/**
 * @desc Uploads an image file to the server
 * @param {File} imageFile - The file object from an input field
 */
const uploadImage = async (imageFile) => {
  const formData = new FormData();

  // Append image file to form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set header for file upload
      },
    });

    return response.data; // Return response data
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error; // Rethrow error for component-level handling
  }
};

export default uploadImage;
