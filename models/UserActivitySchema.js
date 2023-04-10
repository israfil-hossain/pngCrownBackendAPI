const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  lastLoginTime: {
    type: Date,
    required: true,
  },
  lastLogoutTime: {
    type: Date,
    required: false,
  },
  sessionToken: {
    type: String,
    required: true,
  },
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
