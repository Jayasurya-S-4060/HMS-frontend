import axiosInstance from "../api/axiosInstance";

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:3000/api/users/" + id
    );
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export default getUserById;
