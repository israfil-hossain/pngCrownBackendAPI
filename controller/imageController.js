const multer = require("multer");
const ImageModel = require("../models/imageSchema");
require("dotenv").config();
const multerS3 = require("multer-s3");
const { S3Client,DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const S3Storage = multerS3({
  s3: s3,
  bucket: "pngcrownbucket",
  contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the Content-Type header to the MIME type of the uploaded file
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: S3Storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new Error("Only PNG and JPEG images are allowed"));
    }
    cb(null, true);
  },
}).single("image");

const addImage = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;

    const newImagedata = new ImageModel({
      category: req.body.category,
      imageName: req.body.imageName,
      status: req.body.status,
      tags: req.body.tags,
      imageUrl: imageUrl,
      format: req.file.mimetype,
      size: req.file.size,
      public_id: req.file.key,
    });

    newImagedata.save(function (err, savedImage) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to save Image Data to database" });
      }
      res.status(200).header("Content-Disposition", "inline").json({
        message: "Image Data uploaded successfully!",
        imageUrl: imageUrl,
        status: savedImage.status,
        category: savedImage.category,
        tags: savedImage.tags,
        format: savedImage.format,
        size: savedImage.size,
        public_id: savedImage.public_id
      });
    });
  });
};

const updateImage = (req, res) => {
  const { id } = req.params;
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`;
    const imageDataToUpdate = {
      category: req.body.category,
      imageName: req.body.imageName,
      status: req.body.status,
      tags: req.body.tags,
      imageUrl: imageUrl,
      format: req.file.mimetype,
      size: req.file.size,
      public_id: req.file.key,
    };
    ImageModel.findByIdAndUpdate(
      id,
      imageDataToUpdate,
      { new: true },
      function (err, updatedImage) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to update Image Data to database" });
        }
        res.status(200).header("Content-Disposition", "inline").json({
          message: "Image Data updated successfully!",
          imageUrl: updatedImage.imageUrl,
          status: updatedImage.status,
          category: updatedImage.category,
          tags: updatedImage.tags,
          format: updatedImage.format,
          size: updatedImage.size,
          public_id: updatedImage.public_id
        });
      }
    );
  });
};
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// Initialize multer middleware
// Set up Multer upload middleware
// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype !== "image/png") {
//       return cb(new Error("Only PNG images are allowed"));
//     }
//     cb(null, true);
//   },
// }).single("image");

// Handle POST request to upload image and store image URL in database
// const addImage = (req, res) => {
//   upload(req, res, function (err) {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: err.message });
//     }
//     console.log(req.file);

//     // Upload image to Cloudinary
//     cloudinary.uploader.upload(req.file.path, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({ error: "Failed to upload image to Cloudinary" });
//       }
//       console.log("Result is =============> ", result);

//       // Save image URL and status to MongoDB
//       const newImagedata = new ImageModel({
//         category: req.body.category,
//         imageName: req.body.imageName,
//         status: req.body.status,
//         tags: req.body.tags,
//         imageUrl: result.secure_url,
//         public_id: result.public_id,
//         format: result.format,
//         width: result.width,
//         height: result.height,
//         size: result.bytes,
//       });
//       newImagedata.save(function (err) {
//         if (err) {
//           console.log(err);
//           return res
//             .status(500)
//             .json({ error: "Failed to save Image Data to database" });
//         }
//         res.status(200).json({
//           message: "Image Data uploaded successfully!",
//           imageUrl: newImagedata.imageUrl,
//           status: newImagedata.status,
//           category: newImagedata.category,
//           tags: newImagedata.tags,
//           public_id: newImagedata.public_id,
//           format: newImagedata.format,
//           width: newImagedata.width,
//           height: newImagedata.height,
//           size: newImagedata.size,
//         });
//       });
//     });
//   });
// };

// Handle PUT request to update a Image data
// const updateImage = (req, res) => {
//   upload(req, res, function (err) {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: err.message });
//     }
//     console.log(req.file);

//     // Upload image to Cloudinary
//     cloudinary.uploader.upload(req.file.path, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({ error: "Failed to upload image to Cloudinary" });
//       }
//       console.log(result);

//       // Find and update Image Data in MongoDB
//       ImageModel.findByIdAndUpdate(
//         req.params.id,
//         {
//           category: req.body.category,
//           imageName: req.body.imageName,
//           status: req.body.status,
//           tags: req.body.tags,
//           imageUrl: result.secure_url,
//           public_id: result.public_id,
//           format: result.format,
//           width: result.width,
//           height: result.height,
//           size: result.size,
//         },
//         { new: true },
//         function (err, updatedImagedata) {
//           if (err) {
//             console.log(err);
//             return res
//               .status(500)
//               .json({ error: "Failed to update ImageData in database" });
//           }
//           res.status(200).json({
//             message: "Image Data updated successfully!",
//             category: updatedImagedata.category,
//             imageName: updatedImagedata.imageName,
//             status: updatedImagedata.status,
//             tags: updatedImagedata.tags,
//             imageUrl: updatedImagedata.imageUrl,
//             public_id: updatedImagedata.public_id,
//             format: updatedImagedata.format,
//             width: updatedImagedata.width,
//             height: updatedImagedata.height,
//             size: updatedImagedata.size,
//           });
//         }
//       );
//     });
//   });
// };

// const getAllImages = async (req, res) => {
//   try {
//     const imageData = await ImageModel.find();
//     res.status(200).json(imageData);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: "An error occurred while retrieving Image Data",
//     });
//   }
// };

const getAllImages = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    // Validate page and limit parameters
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameter" });
    }
    // Validate sorting parameters
    const validSortFields = ["createdAt", "name"];
    const validSortOrders = ["asc", "desc"];
    if (
      !validSortFields.includes(sortBy) ||
      !validSortOrders.includes(sortOrder)
    ) {
      return res.status(400).json({ error: "Invalid sorting parameter" });
    }
    // Calculate skip and sort options
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    // Retrieve images data
    const imageData = await ImageModel.find()
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);
    // console.log(imageData)
    res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving Image Data",
    });
  }
};

// Get Images by category name wise
const getImageByCategoryName = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const imageData = await ImageModel.find({
      category: categoryName,
      status: "active",
    });
    if (imageData.length > 0) {
      res.status(200).json(imageData);
    } else {
      res.status(404).json({
        error: "No images found for the specified category name",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the Image Data",
    });
  }
};

// Handle GET request to retrieve a single Image Data by ID
const getImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const imageData = await ImageModel.findById(id);
    if (imageData) {
      res.status(200).json(imageData);
    } else {
      res.status(404).json({
        error: "Image Data  not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the Image Data",
    });
  }
};

const deleteImage = async (req, res) => {
  const imageId = req.params.id;

  try {
    const image = await ImageModel.findByIdAndDelete(imageId);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: image.public_id,
    };

    await s3.send(new DeleteObjectCommand(s3Params));

    res.status(200).json({ message: "Image deleted successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete slider" });
  }
};
// const deleteImage = (req, res) => {
//   const imageId = req.params.id;

//   ImageModel.findByIdAndDelete(imageId, function (err, imagedata) {
//     if (err) {
//       console.log(err);
//       return res
//         .status(500)
//         .json({ error: "Failed to delete Image Data from database" });
//     }
//     if (!imagedata) {
//       return res.status(404).json({ error: "Image Data not found" });
//     }
//     // Delete image from Cloudinary
//     cloudinary.uploader.destroy(imagedata.public_id, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res
//           .status(500)
//           .json({ error: "Failed to delete image from Cloudinary" });
//       }
//       console.log(result);
//       res.status(200).json({ message: "Image data deleted successfully!" });
//     });
//   });
// };

module.exports = {
  addImage,
  updateImage,
  getImageById,
  getAllImages,
  deleteImage,
  getImageByCategoryName,
};
