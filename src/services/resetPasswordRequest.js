import axiosInstance from "../api/axiosInstance";

const resetPasswordRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

export default resetPasswordRequest;
