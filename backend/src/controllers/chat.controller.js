import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { getRecieverSocketId, io } from "../utils/socket.js";
import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { Guide } from "../models/guide.models.js";

// Logic to send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { recieverId } = req.params;
  const senderEmail = req.user.email;
  const user = await User.findOne({ userEmail: senderEmail });

  if (!user) {
    throw new ApiError(404, "Sender not found");
  }

  const senderId = user._id;
  const { message } = req.body;
  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message is required to send");
  }

  const newMessage = await Chat.create({
    sender: senderId,
    reciever: recieverId,
    message: message,
  });

  const recieverSocketId = getRecieverSocketId(recieverId);
  if (recieverSocketId) {
    io.to(recieverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({
    success: true,
    data: newMessage,
    message: "Message sent successfully",
  });
});

// Logic to get all chats of the logged-in user
const getUserChats = asyncHandler(async (req, res) => {
  const senderEmail = req.user.email;
  const user = await User.findOne({ userEmail: senderEmail });

  if (!user) {
    throw new ApiError(404, "Sender not found");
  }

  const chats = await Chat.find({
    $or: [{ sender: user._id }, { reciever: user._id }],
  }).sort({ updatedAt: -1 });

  const uniqueUserIds = [];

  chats.forEach((chat) => {
    const senderId = chat.sender.toString();
    const receiverId = chat.reciever.toString();
    const userId = user._id.toString();

    if (senderId !== userId && !uniqueUserIds.includes(senderId)) {
      uniqueUserIds.push(senderId);
    }

    if (receiverId !== userId && !uniqueUserIds.includes(receiverId)) {
      uniqueUserIds.push(receiverId);
    }
  });

  const userProfiles = [];

  for (const id of uniqueUserIds) {
    let profile = await User.findById(id).select(
      "userName userEmail profileImage"
    );

    if (profile) {
      userProfiles.push({
        userId: id,
        userName: profile.userName,
        userEmail: profile.userEmail,
        profileImage: profile.profileImage,
      });
    } else {
      const guide = await Guide.findById(id).select("guideName guideEmail");

      if (guide) {
        userProfiles.push({
          userId: id,
          userName: guide.guideName,
          userEmail: guide.guideEmail,
          profileImage: "",
        });
      }
    }
  }

  res.status(201).json({
    data: userProfiles,
    message: "Fetched chats successfully",
  });
});

// Logic to delete a specific message
const deleteMessage = asyncHandler(async (req, res) => {
  const senderEmail = req.user.email;
  const user = await User.findOne({ userEmail: senderEmail });

  if (!user) {
    throw new ApiError(400, "Sender not found");
  }

  const { messageId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid messaage ID");
  }
  const message = await Chat.findById(messageId);

  if (!message) {
    throw new ApiError(404, "No message found to delete");
  }

  if (message?.sender.toString() !== user?._id.toString()) {
    throw new ApiError(400, "Unauthorized access");
  }

  await Chat.findByIdAndDelete(messageId);

  res.status(201).json({
    success: true,
    message: "Message deleted successfully",
  });
});

// Logic to fetch a chat by ID
const getChatById = asyncHandler(async (req, res) => {
  const { recieverId } = req.params;
  const senderEmail = req.user.email;
  const user = await User.findOne({ userEmail: senderEmail });

  if (!user) {
    throw new ApiError(404, "Sender not found");
  }

  const messages = await Chat.find({
    $or: [
      { sender: user._id, reciever: recieverId },
      { sender: recieverId, reciever: user._id },
    ],
  });

  res.status(201).json({
    success: true,
    data: messages,
    message: "Message sent successfully",
  });
});

export { sendMessage, getUserChats, deleteMessage, getChatById };
