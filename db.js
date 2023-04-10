//External Imports ..... 
const mongoose = require("mongoose"); 
const { success, error } = require("consola"); 
const dotenv = require("dotenv"); 
 

mongoose.set("strictQuery", true);
dotenv.config();

const connectDB = async()=> {
  try {
     mongoose.connect(
      process.env.MONGO_CONNECTION_STRING
    ),{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    success({
        message: `Successfully connected with the Database \n ${process.env.MONGO_CONNECTION_STRING}`,
        badge: true,
    })
    } catch (err) {
    error({
        message: `Unable to Connect with Database \n ${err}`,
        badge: true,
      })
  }
}

module.exports = connectDB; 
