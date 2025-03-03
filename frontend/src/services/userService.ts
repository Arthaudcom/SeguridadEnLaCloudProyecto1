import api from "./api";
import { User, ResetPasswordRequest } from "./types";

export async function registerUser(userData: User) {
  const response = await api.post("/users/", userData);
  return response.data;
}


export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);  // OAuth2 expects 'username' instead of 'email'
  formData.append("password", password);

  const response = await api.post("/users/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

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
