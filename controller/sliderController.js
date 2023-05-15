const multer = require("multer");
const Slider = require("../models/SliderSchema");
require("dotenv").config();
const multerS3 = require("multer-s3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const S3Storage = multerS3({
  s3: s3,
  bucket: "pngcrownslider",
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
    if (
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg"
    ) {
      return cb(new Error("Only PNG, JPG and JPEG images are allowed"));
    }
    cb(null, true);
  },
}).single("image");

// Handle POST request to upload image and store image URL in database
const addSlider = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    console.log(req.file);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME_2}.s3.${
      process.env.AWS_REGION
    }.amazonaws.com/${req.file.key}`;

    // Save image URL and status to MongoDB
    const newSlider = new Slider({
      imageUrl: imageUrl,
      status: req.body.status,
      link: req.body.link,
      public_id: req.file.key,
    });

    newSlider.save(function (err, savedImage) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Failed to save slider to database" });
      }
      res.status(200).header("Content-Disposition", "inline").json({
        message: "Slider image uploaded successfully!",
        imageUrl: imageUrl,
        status: savedImage.status,
        link: savedImage.link,
        public_id: savedImage.public_id,
      });
    });
  });
};

// Handle PUT request to update a slider image
const updateSlider = (req, res) => {
  const { id } = req.params;
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    console.log(req.file);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME_2}.s3.${
      process.env.AWS_REGION
    }.amazonaws.com/${req.file.key}`;

    const sliderDataToUpdate = {
      imageUrl: imageUrl,
      status: req.body.status,
      link: req.body.link,
      public_id: req.file.key,
    };
    Slider.findByIdAndUpdate(
      id,
      sliderDataToUpdate,
      { new: true },
      function (err, updatedImage) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Failed to update Slider Data to database" });
        }
        res.status(200).header("Content-Disposition", "inline").json({
          message: "Slider Data updated successfully!",
          imageUrl: updatedImage.imageUrl,
          status: updatedImage.status,
          link: updatedImage.link,
          public_id: updatedImage.public_id,
        });
      }
    );
  });
};

const getAllSliderImages = async (req, res) => {
  try {
    const sliderImages = await Slider.find().sort({ _id: -1 });
    res.status(200).json(sliderImages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving slider images",
    });
  }
};

// Handle GET request to retrieve a single slider image by ID
const getSliderImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const sliderImage = await Slider.findById(id);
    if (sliderImage) {
      res.status(200).json(sliderImage);
    } else {
      res.status(404).json({
        error: "Slider image not found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while retrieving the slider image",
    });
  }
};

const deleteSlider = async (req, res) => {
  const sliderId = req.params.id;

  try {
    const slider = await Slider.findByIdAndDelete(sliderId);

    if (!slider) {
      return res.status(404).json({ error: "Slider not found" });
    }

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME_2,
      Key: slider.public_id,
    };

    await s3.send(new DeleteObjectCommand(s3Params));

    res.status(200).json({ message: "Slider deleted successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete slider" });
  }
};


module.exports = {
  addSlider,
  updateSlider,
  getSliderImageById,
  getAllSliderImages,
  deleteSlider,
};
