import api from "./api";
import { User, ResetPasswordRequest } from "./types";

export async function registerUser(userData: User) {
  const response = await api.post("/users/", userData);
  return response.data;
}

export async function loginUser(email: string, password: string) {
  const response = await api.post("/users/login", { email, password });
  localStorage.setItem("token", response.data.access_token);
  return response.data;
}

export async function recoverPassword(email: string) {
  const response = await api.post("/users/recover-password", { email });
  return response.data;
}

export async function resetPassword(resetData: ResetPasswordRequest) {
  const response = await api.post("/users/reset-password", resetData);
  return response.data;
}
