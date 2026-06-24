// API helpers
import axios from "axios";

const api = axios.create({
  baseURL: "https://made4u.onrender.com",
});

export default api;
