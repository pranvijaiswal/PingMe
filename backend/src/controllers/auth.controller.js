import express from "express"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"
import crypto from "crypto"
import nodemailer from "nodemailer"


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body //will ask user
    try {

        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required" })
        //hash passwords
        if (password.length < 6)
            return res.status(400).json({ message: "Password should be at least 6 characters long" })

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        if (newUser) {
            //generate jwt tokens here
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else {
            return res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signup:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ message: "User does not exist" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" })

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

        })

    } catch (error) {
        console.log("Error in login:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("error in logout cntroller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userID = await (req.user._id)
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userID, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser)
    }

    catch (error) {
        console.log("Error in updateProfilePic:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const frontendUrl = process.env.NODE_ENV === 'development' //fix
          ? 'http://localhost:5173'
          : 'https://pingme-63rt.onrender.com';

        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ message: "Reset link sent to email" });
    } catch (error) {
        console.error("Error in forgotPassword:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body; //newPassword changed to password
    if (!password || password.trim() === "") { //newPassword changed to password
        return res.status(400).json({ message: "New password is required" });
    }
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}