import api from "./axios";

export const checkAuth = async () => {
  try {
    const response = await api.get("/checkAuth");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Not authenticated");
  }
};
