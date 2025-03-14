import axiosInstance from "../api/axiosInstance";

const editUserById = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:3000/api/users/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export default editUserById;
