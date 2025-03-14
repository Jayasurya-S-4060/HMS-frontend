import axiosInstance from "../api/axiosInstance";

const getUsers = async (param = "") => {
  try {
    const response = await axiosInstance.get(`/api/users/${param}`);
    return response.data;
  } catch (error) {
    return { error: error.response ? error.response.data : error.message };
  }
};

export default getUsers;
