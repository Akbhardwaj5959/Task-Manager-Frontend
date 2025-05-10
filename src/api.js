import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-backend-lbx8.onrender.com/api",
  withCredentials: true,
});

export default api;
