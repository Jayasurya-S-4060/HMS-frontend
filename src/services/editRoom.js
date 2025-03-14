import axiosInstance from "../api/axiosInstance";

const editRoom = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/api/rooms/${id}`, payload);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export default editRoom;
