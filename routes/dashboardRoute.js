// external imports 
const express = require("express"); 

const mongoose = require("mongoose"); 

// internel imports 
const { 
    getAllData,
    
} = require("../controller/dashboardController");


const router = express.Router(); 


// get User API .... 
router.get("/", getAllData ); 




module.exports = router; 