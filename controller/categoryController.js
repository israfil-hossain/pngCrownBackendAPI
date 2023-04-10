const Category = require("../models/CategorySchema");


// get All Category Api  
const  getCategory = async (req,res,next)=>{
    try{
        const category = await Category.find(); 
        res.json(category); 
    }
    catch(err){
        return res.status(500).json({
            errors:{
                common:{
                    msg : `Unknown error occured ! ${err}`,
                }
            }
        })
       
    }
};

//get Single Package Api 
const  getSingleCategory = async (req,res,next)=>{
    try{
        const category = await Category.findById(req.params.id); 
        res.json(category); 
    }
    catch(err){
        return res.status(500).json({
            errors:{
                common:{
                    msg : `Unknown error occured ! ${err}`,
                }
            }
        })
    }
};

// Add Category Api Controller
const addCategory =async (req,res)=>{
    let newCategory ; 
    newCategory = new Category({
        ...req.body
    })
    try{
        await newCategory.save(); 
        res.status(200).json({
            message:"Category Add Successfully !",
        })
    }
    catch(err){
        res.status(500).json({
            errors:{
                common:{
                    msg: "Unknown Error Occured " 
                }
            }
        })
    }
};


// Update Category Api Controller 
const updateCategory = async(req,res,next)=>{
    try {
        const UpdateCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.send(UpdateCategory);
        }
    catch (error) {
        res.status(400).send(error);
    }
}

// Delete Category Api Controller
const deleteCategory = async(req,res,next)=>{
    try{
        const id = req.params.id; 
        const data = await Category.findByIdAndDelete(id); 
        res.send(`Document with ${data.cat_name} has been deleted... `)
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    getCategory, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    getSingleCategory,

}