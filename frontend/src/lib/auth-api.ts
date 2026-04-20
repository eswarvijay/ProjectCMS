import API from "./api";

export const login = (data: { email: string; password: string }) =>
  API.post("/api/auth/login", data);

// ✅ ADD THIS
export const register = (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => API.post("/api/auth/register", data);
