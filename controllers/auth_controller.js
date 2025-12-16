import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import User from "../models/user_models.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";
import { emailVerificationMailgenContent, sendMail } from "../utils/mail.js";

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUserController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unhashToken, hashToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendMail({
    email: user.email,
    subject: "Verify your email",
    mailContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify-email/${unhashToken}`
    ),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while Registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully. Verification email sent."
      )
    );
});

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in");
  }

  const options = {
    httpOnly: true,
    secure: true, // production me true
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: "" },
    { validateBeforeSave: false }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const getCurrentuser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched succesfully"));
});

// http://localhost:8000/api/v1/users/verify-email/33e28c1a892352a1501fa407bd6c6db770e7edde

const emailVerify = asyncHandler(async (req, res) => {
  const { emailVerifyToken } = req.params;

  if (!emailVerifyToken) {
    throw new ApiError(400, "email verification token is missing");
  }

  const hashToken = crypto
    .createHash("sha256")
    .update(emailVerifyToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "token is invalid or expired ");
  }
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(
      new ApiResponse(200, { isEmailVerifiedData: user }, "Email is verified")
    );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  if (user?.isEmailVerified) {
    throw new ApiError(409, "Email is already verified");
  }
  const { unhashToken, hashToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendMail({
    email: user.email,
    subject: "Verify your email",
    mailContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify-email/${unhashToken}`
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "mail has been send your email ID"));
});

const refreshToken = asyncHandler(async (req, res) => {});

export {
  registerUserController,
  loginUserController,
  logOutUser,
  getCurrentuser,
  emailVerify,
  resendEmailVerification,
  refreshToken
};
