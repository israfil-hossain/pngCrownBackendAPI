// external imports 
const {check, validationResult } = require("express-validator"); 
const createError = require("http-errors");
const path = require("path"); 
const { unlink } = require("fs"); 

// internal imports 
const User = require("../../models/People"); 

// add user validators .................

const addUserValidators =[
    
    // Name Validation ................. 
    check("name")
    .isLength({
        min: 3
    })
    .withMessage("Name is required ")
    .isAlpha("en-US",{ignore:" -"})
    .withMessage("Name must not contain anything other than alphabet")
    .trim(), 

    // Email Validation ...............
    check("email").isEmail().withMessage("Invalid email address").trim()
    .custom(async (value) => {
        try{
            const user = await User.findOne({email:value}); 
            if(user){
                // return res.status(401).json({
                //     message : "Email already used ",
                //     // success:true,
                // })
                throw createError(409, "Email already in used !"); 
            }
        }
        catch(err){
            throw createError(500,err.message); 
        }
    }),

    // Phone Validation ............. 
    check("mobile")
    .isMobilePhone()
    .withMessage("Mobile number must be a valid ")
    .custom(async(value)=>{
        try{
            const user = await User.findOne({mobile:value}); 
            if(user){
                throw createError(409,"Mobile Number already in used!"); 
            }
        }
        catch(err){
            throw createError(500,err.message); 
        }
    }),

    // Password Validation ............. 
    check("password")
    .isLength(6)
    .withMessage("Password must be at least 6 chracter "),

]; 
// .isStrongPassword()


const addUserValidationHandler = function(req,res,next){
    const errors = validationResult(req); 
    // const mappedErrors = errors.mapped(); 
    // if(Object.keys(mappedErrors).length === 0 ){
    //     next(); 
    // }
    if(errors.isEmpty()){
        next();
    }
    else{
        const mappedErrors = errors.mapped(); 

        const error = createError(422, "Validation failed! Correct your inputs and try again", { errors: mappedErrors });
        // next(error);
        res.send({
            error
        });
    }
}

module.exports = {
    addUserValidators,
    addUserValidationHandler
}