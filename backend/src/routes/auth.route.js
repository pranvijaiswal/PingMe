import express from "express"
import {signup,login,logout,updateProfilePic,checkAuth, forgotPassword,
  resetPassword } from "../controllers/auth.controller.js"
 import {protectRoute} from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/updateProfilePic",protectRoute, updateProfilePic)

router.get("/check",protectRoute,checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;