import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { hash, compare } from "bcryptjs";

// Logic to send a message
const sendMessage = asyncHandler(async (req, res) => {

});

// Logic to fetch messages for a chat
const receiveMessages = asyncHandler(async (req, res) => {
    
});

// Logic to get all chats of the logged-in user
const getUserChats = asyncHandler(async (req, res) => {
    
});

// Logic to delete a specific message
const deleteMessage = asyncHandler(async (req, res) => {
    
});

// Logic to fetch a chat by ID
const getChatById = asyncHandler(async (req, res) => {
    
});


export {
    sendMessage,
    receiveMessages,
    getUserChats,
    deleteMessage,
    getChatById
};
