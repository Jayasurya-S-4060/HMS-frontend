import axiosInstance from "../api/axiosInstance";

const url = "/api/rooms/roomHistory";

const getRooms = async () => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export default getRooms;
