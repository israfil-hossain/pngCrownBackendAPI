// User Model 
const mongoose = require("mongoose"); 


const categorySchema  = mongoose.Schema({
    cat_name:{
        type:String, 
        required : true, 
        trim : true, 
    }, 
    cat_status: {
        type:String, 
        required: true, 
        trim : true, 
        lowercase : true, 
    },
    create_date:{
        type:Date, 

    }
},{timestamps: true });

const Category =  mongoose.model("Category",categorySchema); 

module.exports = Category; 
