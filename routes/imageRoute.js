// external imports
const express = require("express");
const DownloadModel = require("../models/DownloadSchema");
const router = express.Router(); 

// const { SearchCity, CreateCity,UpdateCity } =
//   require("../controller/hotelController");
const { 
    addImage,
    updateImage,
    getImageById,
    getAllImages,
    deleteImage,
    download
} = require("../controller/imageController");
const { imageValidator,imageValidationHandler } = require("../middleware/image/imageValidator");
// get Image 
router.get("/",getAllImages);

//download images 
router.get('/download/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    DownloadModel.findOne({ imageName: imageName }, (err, downloadStats) => {
        if (err) {
          console.error('Error finding download stats:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
    
        if (!downloadStats) {
          // Create new download stats record for image
          downloadStats = new DownloadModel({ imageName: imageName });
        }
    
        downloadStats.downloadCount++;
        downloadStats.save((err) => {
          if (err) {
            console.error('Error updating download stats:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }
    
          console.log(`Download count for ${imageName}: ${downloadStats.downloadCount}`);
    
          // Send response with 200 status code
        //   res.sendStatus(200).send(`Download count for ${imageName}: ${downloadStats.downloadCount}`);
          res.status(200).json({
            message: 'Image Download successfully!',
           
          });
        });
      });
  });
// get by Single Image
router.get("/:id",getImageById); 

// post Image 
router.post("/add",addImage); 

// delete Image
router.delete("/delete/:id",deleteImage); 

// update Image
router.put("/update/:id",updateImage); 


module.exports = router;
