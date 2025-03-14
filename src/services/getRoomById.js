import axiosInstance from "../api/axiosInstance";

const getRoomById = async (id) => {
  try {
    const response = await axiosInstance.get("/api/rooms/" + id);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export default getRoomById;
