import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { getRecieverSocketId, io } from "../utils/socket.js";
import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { Guide } from "../models/guide.models.js";

export const getUserByEmail = async (email) => {
  const user =
    (await User.findOne({ userEmail: email })) ||
    (await Guide.findOne({ guideEmail: email }));
  return user;
};

// Logic to send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { message } = req.body;

  if (!message?.trim()) {
    throw new ApiError(400, "Message cannot be empty");
  }

  try {
    if (!req.user || !req.user.email) {
      throw new ApiError(401, "Unauthorized - No user data");
    }

    const sender =
      (await User.findOne({ userEmail: req.user.email })) ||
      (await Guide.findOne({ guideEmail: req.user.email }));

    if (!sender) throw new ApiError(404, "Sender account not found");

    const senderModel = sender.userEmail ? "User" : "Guide";

    let receiver, receiverModel;

    if (mongoose.Types.ObjectId.isValid(receiverId)) {
      receiver = await User.findById(receiverId);
      if (receiver) {
        receiverModel = "User";
      } else {
        receiver = await Guide.findById(receiverId);
        if (receiver) {
          receiverModel = "Guide";
        }
      }
    }

    if (!receiver) {
      throw new ApiError(404, "Receiver not found");
    }

    const conversationId = [sender._id.toString(), receiverId].sort().join("_");

    const newMessage = await Chat.create({
      sender: sender._id,
      senderModel,
      receiver: receiverId,
      receiverModel,
      conversationId,
      message: message.trim(),
    });

    const populatedMessage = await newMessage.populate([
      {
        path: "sender",
        select: "userName guideName userEmail guideEmail profileImage",
        model: senderModel,
      },
      {
        path: "receiver",
        select: "userName guideName userEmail guideEmail profileImage",
        model: receiverModel,
      },
    ]);

    // After creating the message
    const receiverSocketId = getRecieverSocketId(receiverId);
    const senderSocketId = getRecieverSocketId(sender._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", populatedMessage);
    }

    // Also emit to the conversation room
    io.to(conversationId).emit("newMessage", populatedMessage);

    return res.status(201).json({
      success: true,
      data: populatedMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Message creation error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to send message");
  }
});

// Logic to get all chats of the logged-in user
const getUserChats = asyncHandler(async (req, res) => {
  const sender = await getUserByEmail(req.user.email);
  if (!sender) throw new ApiError(404, "Sender not found");

  const chats = await Chat.find({
    $or: [{ sender: sender._id }, { receiver: sender._id }],
  }).sort({ updatedAt: -1 });

  const conversationMap = new Map();

  chats.forEach((chat) => {
    const otherUserId = chat.sender.equals(sender._id)
      ? chat.receiver.toString()
      : chat.sender.toString();
    const conversationId = [sender._id.toString(), otherUserId]
      .sort()
      .join("_");

    if (!conversationMap.has(conversationId)) {
      conversationMap.set(conversationId, { userId: otherUserId });
    }
  });

  const userProfiles = [];
  for (const { userId } of conversationMap.values()) {
    let profile =
      (await User.findById(userId).select("userName userEmail profileImage")) ||
      (await Guide.findById(userId).select("guideName guideEmail"));

    if (profile) {
      userProfiles.push({
        userId,
        userName: profile.userName || profile.guideName,
        userEmail: profile.userEmail || profile.guideEmail,
        profileImage: profile.profileImage || "",
      });
    }
  }

  res.status(200).json({
    data: userProfiles,
    message: "Fetched chats successfully",
  });
});

// Logic to delete a specific message
const deleteMessage = asyncHandler(async (req, res) => {
  const sender = await getUserByEmail(req.user.email);
  if (!sender) throw new ApiError(400, "Sender not found");

  const { messageId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    throw new ApiError(400, "Invalid message ID");
  }

  const message = await Chat.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  if (message.sender.toString() !== sender._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await Chat.findByIdAndDelete(messageId);

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});

// Logic to fetch a chat by conversationId
const getChatById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const user = await getUserByEmail(req.user.email);

  if (!user) throw new ApiError(401, "Unauthorized");

  const messages = await Chat.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate({
      path: "sender",
      select: "userName guideName userEmail guideEmail profileImage",
    })
    .populate({
      path: "receiver",
      select: "userName guideName userEmail guideEmail profileImage",
    });

  res.status(200).json({
    success: true,
    data: messages,
    message: "Fetched messages successfully",
  });
});

// Logic to get all user chatted with the logged-in guide
const getGuideChats = asyncHandler(async (req, res) => {
  const guide = await Guide.findOne({ guideEmail: req.user.email });
  if (!guide) throw new ApiError(404, "Guide not found");

  const chats = await Chat.find({
    $or: [{ sender: guide._id }, { receiver: guide._id }],
  }).sort({ updatedAt: -1 });

  const conversationMap = new Map();
  chats.forEach((chat) => {
    const otherUserId = chat.sender.equals(guide._id)
      ? chat.receiver.toString()
      : chat.sender.toString();
    const convId = [guide._id.toString(), otherUserId].sort().join("_");
    if (!conversationMap.has(convId)) {
      conversationMap.set(convId, { userId: otherUserId });
    }
  });

  const chatPartners = [];
  for (const { userId } of conversationMap.values()) {
    const profile =
      (await User.findById(userId).select("userName userEmail profileImage")) ||
      (await Guide.findById(userId).select(
        "guideName guideEmail profileImage"
      ));

    if (profile) {
      chatPartners.push({
        _id: profile._id,
        name: profile.userName || profile.guideName,
        email: profile.userEmail || profile.guideEmail,
        photo: profile.profileImage || "",
      });
    }
  }

  res.status(200).json({
    success: true,
    data: chatPartners,
    message: "Guide chat partners fetched successfully",
  });
});

export { sendMessage, getUserChats, deleteMessage, getChatById, getGuideChats };
