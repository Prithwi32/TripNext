import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { hash, compare } from "bcryptjs";

//get all Trips belonging to all user
const viewAllTrip = asyncHandler(async (req, res) => {

});

//get all Tips belonging to a particular user
const viewTrips = asyncHandler(async (req, res) => {

});

//create a trip for a particular user
const createTrip = asyncHandler(async (req, res) => {

});

//update the trip details belonging to a particular user
const updateTrip = asyncHandler(async (req, res) => {

});

//delete a trip belonging to a particular user
const deleteTrip = asyncHandler(async (req, res) => {

});

export {
    viewAllTrip,
    viewTrips,
    createTrip,
    deleteTrip,
    updateTrip
}