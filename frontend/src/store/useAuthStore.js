import {create} from "zustand";
import { data } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data});
        } catch (error) {
            console.log("Error in checkauth", error);
            set({ authUser: null});
        }
        finally {
            set({ isCheckingAuth: false});
        }
    },
   signup: async(data) => {
      set({ isSigningUp: true });
    try {
        
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
       return true;
      
      
    //   get().connectSocket();
        } 
    catch (error) 
    {
      toast.error(error.response.data.message);
      set({ authUser: null });
    return false;
    } 
    finally {
      set({ isSigningUp: false });
    }
    }
   }));