import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return (accessToken, refreshToken);
  } catch (error) {
    console.log("error :", error);
    throw new ApiError(500, "something went wrong");
  }
};

const createUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, role } = req.body;
  if (!username || !fullname || !email || !password || !role) {
    throw new ApiError(404, "all fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user already exist");
  }
  const createdUser = await User.create({
    username,
    fullname,
    email,
    password,
    role,
  });

  const checkcreated = await User.findById(createdUser._id);
  if (!checkcreated) {
    throw new ApiError(500, "not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, checkcreated, "aree bn gya tension na le "));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(401, "all fields are required");
  }
  const existlogin = await User.findOne({
    $or: [{ username: username || "" }, { email: email || "" }],
  });
  if (!existlogin) {
    throw new ApiError(500, "login does not exist");
  }

  const ispassValid = await existlogin.isPasswordCorrect(password);
  if (!ispassValid) {
    throw new ApiError(401, "Invalid password");
  }
  const { refreshToken, accessToken } = await generateTokens(existlogin._id);
  const loggedinUser = await USER.findById(existlogin._id).select(
    -"password -refreshtoken",
  );

  const options = {
    httponly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully",
      ),
    );
});

export { generateTokens, createUser,loginUser };
