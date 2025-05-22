import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { hash, compare } from "bcryptjs";
import { Comment } from "../models/comment.model.js";

// Get all comments (with nested replies) for a blog
const getAllComments = asyncHandler(async (req, res) => {
  
});

// Add a top-level comment
const addComment = asyncHandler(async (req, res) => {
  
});

// Reply to an existing comment
const replyToComment = asyncHandler(async (req, res) => {
  
});

// Update a comment or reply
const updateComment = asyncHandler(async (req, res) => {
  
});

// Delete a comment or reply
const deleteComment = asyncHandler(async (req, res) => {
  
});

export {
  getAllComments,
  addComment,
  replyToComment,
  updateComment,
  deleteComment
};
