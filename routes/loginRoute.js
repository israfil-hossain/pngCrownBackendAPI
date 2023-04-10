// external imports 
const express = require("express"); 

// internel imports 
const {login,logout,getUserActivity,deleteUserActivity} = require("../controller/loginController"); 
const {doLoginValidators,doLoginValidationHandler} = require("../middleware/login/loginValidator")
const router = express.Router(); 


// process login 
router.post("/login",doLoginValidators,doLoginValidationHandler, login); 

//logout 
router.delete("/logout",logout); 

//get User Activity 
router.get("/user-activity",getUserActivity); 

//delete User Activity 
router.delete("/user-activity/delete/:id",deleteUserActivity);

module.exports = router; 