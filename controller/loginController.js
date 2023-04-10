const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/People");
const UserActivity = require("../models/UserActivitySchema");

const login = async (req, res, next) => {
  console.log(req);
  try {
    // Find user by either email or mobile
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (!user) {
      // User not found
      return res.status(401).json({
        message: "Login failed! Username is invalid.",
      });
    }

    // Compare provided password with hashed password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      // Password does not match
      return res.status(401).json({
        message: "Login failed! Password is incorrect",
      });
    }

    // Prepare payload for JWT
    const payload = {
      username: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
    };

    // Generate JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    // Set JWT as cookie
    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: process.env.JWT_EXPIRY,
      httpOnly: true,
      signed: true,
    });

    // Set logged in user as local identifier
    res.locals.loggedInUser = payload;

    // Update user's last activity time
    const now = new Date();
    await User.findByIdAndUpdate(user._id, { lastActivity: now });

    // Store user's activity in UserActivity collection
    const userActivity = new UserActivity({
      username: user.email,
      lastLoginTime: now,
      sessionToken: token,
    });
    await userActivity.save();

    // Return success status
    return res.status(200).json({
      message: "Login successful!",
      token,
      username: user.name,
      email: user.email,
      role: user.role,
      statusbar: "Success",
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server error ${err}`,
    });
  }
};
const logout = async (req, res) => {
  console.log("Response logged out",res);
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged Out Successfully");
  // try {

  //   // Find user by email
  //   const user = await User.findOne({ email: req.body.email });
  //   if (!user) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "User not found",
  //     });
  //   }

  //   // Update user's last activity and last logout time
  //   const now = new Date();
  //   const updateUserResult = await User.findByIdAndUpdate(user._id, {
  //     lastActivity: now,
  //     $push: { activityLog: { action: "logout", timestamp: now } },
  //   });

  //   if (!updateUserResult) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "Logout failed! User update failed",
  //     });
  //   }

  //   // Remove session token from localStorage
  //   res.clearCookie(process.env.COOKIE_NAME);

  //   // Update user's last logout time and session token in UserActivity collection
  //   const updateUserActivityResult = await UserActivity.findOneAndUpdate(
  //     { username: user.email},
  //     { lastLogoutTime: now, session: null },
  //     { new: true }
  //   );

  //   if (!updateUserActivityResult) {
  //     return res.status(401).json({
  //       success: false,
  //       message: "Logout failed! User activity not found",
  //     });
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     message: "Logout successful",
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({
  //     success: false,
  //     message: error.message,
  //   });
  // }
};

const getUserActivity = async (req, res, next) => {
  try {
    // Fetch user activity data from the database
    const userActivity = await UserActivity.find();

    // Return user activity data as response
    return res.status(200).json({
      message: "User activity retrieved successfully",
      userActivity,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server error ${err}`,
    });
  }
};
const deleteUserActivity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await UserActivity.findByIdAndDelete(id);
    res.status(200).send(`Document with ${data.name} has been deleted... `);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  login,
  logout,
  getUserActivity,
  deleteUserActivity,
};
