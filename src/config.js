// API configuration
export const API_URL = import.meta.env.PROD
  ? "https://scale-bridge-backend.vercel.app/api"
  : "http://localhost:5000/api";

export default API_URL;
