// external imports
const express = require("express");

const router = express.Router(); 

// const { SearchCity, CreateCity,UpdateCity } =
//   require("../controller/hotelController");
const { 
    addImage,
    updateImage,
    getImageById,
    getAllImages,
    deleteImage,
} = require("../controller/imageController");
const { imageValidator,imageValidationHandler } = require("../middleware/image/imageValidator");
// get Image 
router.get("/",getAllImages);

// get by Single Image
router.get("/:id",getImageById); 

// post Image 
router.post("/add",addImage); 

// delete Image
router.delete("/delete/:id",deleteImage); 

// update Image
router.put("/update/:id",updateImage); 


module.exports = router;
