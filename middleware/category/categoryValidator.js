// external imports 
const {check, validationResult } = require("express-validator"); 
const createError = require("http-errors"); 
const Category = require("../../models/CategorySchema"); 

const categoryValidator=[
    check("cat_name")
    .isLength({
        min:2
    })
    .withMessage("Category name is required !")
    .custom(async(value)=>{
        try{
            const category = await Category.findOne({cat_name:value}); 
            if(category){
                throw createError(409,"Category Name already in used!"); 
            }
        }
        catch(err){
            throw createError(500,err.message); 
        }
    }), 

    check("cat_status")
    .isLength({
        min:3
    })
    .withMessage("Category Status is required !"), 
]; 

const categoryValidationHandler = (req,res,next)=>{
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
    categoryValidator, 
    categoryValidationHandler
}