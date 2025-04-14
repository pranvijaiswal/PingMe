import express from "express"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"


export const signup =async (req, res) => {
    const {fullname, email, password} = req.body //will ask user
 try {

    if(!fullname || !email || !password)
        return res.status(400).json({message: "All fields are required"})
    //hash passwords
    if(password.length < 6) 
        return res.status(400).json({message: "Password should be at least 6 characters long"})

    const user  = await User.findOne({email})
    if(user) {
        return res.status(400).json({message: "User already exists"})
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        fullname:fullname,
        email:email,
        password: hashedPassword
    })
    if(newUser) {
        //generate jwt tokens here
        generateToken(newUser._id, res)
        await newUser.save()
        res.status(201).json({
            _id: newUser._id,   
            fullname: newUser.fullname,
            email: newUser.email,
            profilePic: newUser.profilePic,

            })
    }
    else {
        return res.status(400).json({message: "Invalid user data"})
    }
   
 } catch (error) {
    console.log("Error in signup:", error.message)
    res.status(500).json({message: "Internal server error"})
 }
}

export const login = async (req, res) => {
    const {email, password} = req.body
   try {
    const user =await User.findOne({email})
    if(!user)
        return res.status(400).json({message: "User does not exist"})

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        return res.status(400).json({message: "Invalid credentials"})

    generateToken(user._id, res)
    res.status(200).json({
        _id: user._id,   
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,

        })

   } catch (error) {
    console.log("Error in login:", error.message)
    res.status(500).json({message: "Internal server error"})
   }
}

export const logout = (req, res) => {
     try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"})
     } catch (error) {
        console.log("error in logout cntroller", error.message)
        res.status(500).json({message: "Internal server error"})
     }
}

export const updateProfilePic = async (req, res) => {
    try {
        const {profilePic} = req.body
        const userID = await (req.user._id)
        if(!profilePic) {
            return res.status(400).json({message: "Profile pic is required"})
        }
      const uploadResponse= await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(userID, {profilePic: uploadResponse.secure_url}, {new: true})
      res.status(200).json(updatedUser)
        }
        
     catch (error) {
        console.log("Error in updateProfilePic:", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const checkAuth =  (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth:", error.message)
        res.status(500).json({message: "Internal server error"})
} 
}    