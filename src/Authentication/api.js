import axios from "axios";

const api = axios.create({
  baseURL: "https://talent-backend-i83x.onrender.com/api",
  withCredentials: true,  // ⭐ allows sending HttpOnly cookies
});

export default api;
