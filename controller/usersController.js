//external Import
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");
const User = require("../models/People");
const { Model } = require("mongoose");

// get All User Api  Controller
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return res.status(500).json({
      // message:"Unknown error occured !",
      // success:false,
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

//get Single User Api Controller
const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

// Add User Api Controller
async function addUser(req, res, next) {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();
  const formattedDate = `${day}-${month}-${year}`;
  
  let newUser;
  const hashPassword = await bcrypt.hash(req.body.password, 6);
  newUser = new User({
    ...req.body,
    password: hashPassword,
    joindate: formattedDate,
  });
 
  // save user or send error
  try {
    await newUser.save();
    return res.status(200).json({
      message: "User added Successfully ! ",
      // success:true,
    });
  } catch (err) {
    return res.status(500).json({
      // message:"Unknown error occured !",
      // success:false,
      errors: {
        common: {
          msg: "Unknown error occured !",
        },
      },
    });
  }
}

// Update User Api Controller
const updateUser = async (req, res) => {
  try {
    const updatedPerson = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPerson) {
      return res.status(404).send("User not found");
    }
    res.send(updatedPerson);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// Delete User Api Controller
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted... `);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



module.exports = {
  getUsers,
  getSingleUser,
  addUser,
  updateUser,
  deleteUser,
};
