import axiosInstance from "../api/axiosInstance";

const createRoom = async (payload) => {
  try {
    const response = await axiosInstance.post(`/api/rooms`, payload);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export default createRoom;
