import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";

// Get all comments (with nested replies) for a blog
const getAllComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  // Fetch top-level comments
  const comments = await Comment.find({ blogId, commentId: null })
    .populate({
      path: "userId",
      select: "userName profileImage",
    })
    .sort({ createdAt: -1 }) 
    .lean();

  // For each top-level comment, fetch its replies
  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({ commentId: comment._id })
        .populate("userId", "userName profileImage")
        .populate("toUserId", "userName profileImage")
        .lean();
      return { ...comment, replies };
    })
  );

  res.status(200).json({
    success: true,
    data: commentsWithReplies,
  });
});

// Add a top-level comment
const addComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  if (!message) {
    throw new ApiError(400, "Comment message is required");
  }

  const newComment = await Comment.create({
    userId,
    blogId,
    message,
  });

  // Populate the user data before sending the response
  const populatedComment = await Comment.findById(newComment._id).populate(
    "userId",
    "userName profileImage"
  );

  res.status(201).json({
    success: true,
    data: populatedComment,
  });
});

// Reply to an existing comment
const replyToComment = asyncHandler(async (req, res) => {
  const { blogId, parentCommentId } = req.params;
  const { message, toUserId } = req.body;
  const userId = req.user._id;

  if (!message) {
    throw new ApiError(400, "Reply message is required");
  }

  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new ApiError(404, "Parent comment not found");
  }

  const reply = await Comment.create({
    userId,
    blogId,
    message,
    commentId: parentCommentId,
    toUserId: toUserId || parentComment.userId,
  });
  // Populate both userId and toUserId before sending response
  const populatedReply = await Comment.findById(reply._id)
    .populate({
      path: "userId",
      select: "userName email profileImage profilePicture",
    })
    .populate({
      path: "toUserId",
      select: "userName email profileImage profilePicture",
    });

  res.status(201).json({
    success: true,
    data: populatedReply,
  });
});

// Update a comment or reply
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { message } = req.body;
  const userId = req.user._id;

  if (!message) {
    throw new ApiError(400, "Updated message is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.message = message;
  await comment.save();
  // Populate user fields before sending response
  const updatedComment = await Comment.findById(commentId)
    .populate({
      path: "userId",
      select: "userName email profileImage profilePicture",
    })
    .populate({
      path: "toUserId",
      select: "userName email profileImage profilePicture",
    });

  res.status(200).json({
    success: true,
    data: updatedComment,
  });
});

// Delete a comment or reply
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  // If it's a parent comment, delete its replies too
  await Comment.deleteMany({
    $or: [{ _id: commentId }, { commentId }],
  });

  res.status(200).json({
    success: true,
    message: "Comment and its replies deleted successfully",
  });
});

export {
  getAllComments,
  addComment,
  replyToComment,
  updateComment,
  deleteComment,
};
