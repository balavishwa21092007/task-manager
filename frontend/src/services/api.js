import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-api-4x18.onrender.com",
});

export default api;