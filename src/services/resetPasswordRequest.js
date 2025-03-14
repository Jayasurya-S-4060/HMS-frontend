import axiosInstance from "../api/axiosInstance";

async function resetPasswordRequest(params) {
  const url = import.meta.env.VITE_API_URL;
  try {
    await axiosInstance.post(url + "/api/reset-password-request", params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

export default resetPasswordRequest;
