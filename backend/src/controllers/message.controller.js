
import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
export const getUsersforSidebar = async (req, res) => {
    try {
        const loggedinUserID = req.user._id
        const filteredusers = await User.find({ _id: { $ne: loggedinUserID } }).select("-password")
        res.status(200).json(filteredusers)
    } catch (error) {
        console.log("Error in getUsersforSidebar:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: UsertoChatID } = req.params
        const myID = req.user._id
        const messages = await Message.find({
            $or: [{
                senderID: myID,
                receiverID: UsertoChatID
            },
            {
                senderID: UsertoChatID,
                receiverID: myID
            }]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverID } = req.params
        const { text, image } = req.body
        const senderID = req.user._id
        let imageUrl
        if (image) {
            //upload the base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageUrl
        })
        await newMessage.save()
 
        // todo : realtime functionality through socket.io
        const receiverSocketID=getReceiverSocketId(receiverID)
        if(receiverSocketID){
            io.to(receiverSocketID).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)


        
    } catch (error) {
        console.log("Error in sendMessage:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}