import axios from "axios";

const api = axios.create({
  baseURL: "https://talent-assess.in/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;