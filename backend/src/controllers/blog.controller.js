import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { hash, compare } from "bcryptjs";

//create a blog for user
const createBlog = asyncHandler(async (req, res) => {

});

//update a blog by user
const updateBlog = asyncHandler(async (req, res) => {

});

//delete a blog by id and user
const deleteBlog = asyncHandler(async (req, res) => {

});

//get only the user blogs
const getBlogs = asyncHandler(async (req, res) => {

});

//get all blogs except for the blogs created by the requesting user
const getAllBlogs = asyncHandler(async (req, res) => {

});

export {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlogs
}