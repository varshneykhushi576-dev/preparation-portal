import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res,next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "unauthorised request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    console.log("failing here");
  }
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(403, "token expiry");
  }

  req.user = user;
  next();
});

const isAdmin = (req,res,next)=>{
    if(req.user?.role !== "ADMIN" && req.user?.role!=="TEACHER"){
        throw new ApiError(403,"Authorization error ")
    }
    next();
}
export {
    verifyJWT,
    isAdmin
}