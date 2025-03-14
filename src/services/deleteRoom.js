import axiosInstance from "../api/axiosInstance";

const deleteRoom = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/rooms/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export default deleteRoom;
