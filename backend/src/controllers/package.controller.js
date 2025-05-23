import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { hash, compare } from "bcryptjs";


//get all the package belonging to a particular guide
const getPackage = asyncHandler(async (req, res) => {

});

//get all the package of all guides
const getAllPackage = asyncHandler(async (req, res) => {

});

//create a package for a particular guide
const createPackage = asyncHandler(async (req, res) => {

});

//update a packagae belonging to a guide
const updatePackage = asyncHandler(async (req, res) => {

});

//delete a package belonging to a guide
const deletePackage = asyncHandler(async (req, res) => {

});

export {
    getAllPackage,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
}