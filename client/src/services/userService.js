import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  try {
    // Try to get token from user object first
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData?.token) {
        req.headers.Authorization = `Bearer ${userData.token}`;
        return req;
      }
    }
    
    // Fallback to separately stored token
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error setting authorization header:", err);
  }
  return req;
});

export const followUser = (id) => API.put(`/users/follow/${id}`);
export const getProfile = () => API.get(`/users/me`);
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put(`/users/me`, data);
export const uploadProfilePic = (formData) => {
  const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user") || "{}")?.token;
  return API.put(`/users/me/profile-pic`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProfilePic = () => API.delete(`/users/me/profile-pic`);
