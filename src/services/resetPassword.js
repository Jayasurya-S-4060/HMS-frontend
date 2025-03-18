import axiosInstance from "../api/axiosInstance";

const resetPassword = async (data, token) => {
  try {
    const response = await axiosInstance.post(
      `/api/auth/reset-password/${token}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

export default resetPassword;
