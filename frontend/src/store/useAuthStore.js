import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSendingResetEmail: false,
  isResettingPassword: false,
  onlineUsers: [],
  socket: null,


  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      console.log(response.data);
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkauth", error);
      set({ authUser: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {

      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    }
    catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error.response.data.message);
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfilePic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isSendingResetEmail: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      set({ isSendingResetEmail: false });
    }
  },


  resetPassword: async (token, newPassword) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password: newPassword });
      toast.success("Password reset successfully. You can now login.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      set({ isResettingPassword: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  }

}));