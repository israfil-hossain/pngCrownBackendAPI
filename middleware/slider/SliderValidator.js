// external imports 
const {check, validationResult } = require("express-validator"); 
const createError = require("http-errors"); 
const Slider = require("../../models/SliderSchema"); 

const sliderValidator=[
    check("imageUrl")
    .notEmpty()
    .withMessage("Image URL is required !"),
]; 

const sliderValidationHandler = (req,res,next)=>{
    const errors = validationResult(req); 
    const mappedErrors = errors.mapped(); 
    if(Object.keys(mappedErrors).length === 0 ){
        next(); 
    }
    else{
        res.status(500).json({
            errors:mappedErrors, 
        })
    }
}

module.exports = {
    sliderValidator, 
    sliderValidationHandler
}