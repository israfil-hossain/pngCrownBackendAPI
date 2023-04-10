// external imports
const express = require("express");

const router = express.Router(); 

const { sliderValidator, sliderValidationHandler} = require("../middleware/slider/SliderValidator");

const { 
    addSlider,
    updateSlider,
    getSliderImageById,
    getAllSliderImages,
    deleteSlider
} = require("../controller/sliderController");

// get slider 
router.get("/",getAllSliderImages);

// get by Single Slider
router.get("/:id",getSliderImageById); 

// post Slider 
router.post("/add",addSlider ); 

// delete Slider
router.delete("/delete/:id",deleteSlider); 

// update Slider
router.put("/update/:id",updateSlider); 


module.exports = router;
