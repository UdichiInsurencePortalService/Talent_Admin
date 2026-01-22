import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,  // ⭐ allows sending HttpOnly cookies
});

export default api;
